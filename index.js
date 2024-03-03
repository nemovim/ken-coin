import dotenv from 'dotenv';
import mongoose from 'mongoose';
import AccountManager from './lib/modules/accountManager.js';
import MissionManager from './lib/modules/missionManager.js';
import TransactionManager from './lib/modules/transactionManager.js';
import mission from './lib/models/mission.js';

dotenv.config();

class CoinDB {
    async init() {
        try {
            return await mongoose.connect(process.env.COIN_MONGO_URI);
        } catch (e) {
            throw new Error(e.message);
        }
    }
}

class CoinManager {
    static async transactCoin(transactionObj) {
        if (await this.#canTransact(transactionObj)) {
            return await Promise.allSettled([
                TransactionManager.createTransaction(transactionObj),
                AccountManager.updateAmountByAid(
                    transactionObj.giver,
                    -transactionObj.volume
                ),
                AccountManager.updateAmountByAid(
                    transactionObj.taker,
                    transactionObj.volume
                ),
            ]);
        }
    }

    static async #canTransact(transactionObj) {
        if (
            Number(transactionObj.volume) <= 0 ||
            !Number.isInteger(Number(transactionObj.volume))
        ) {
            throw new Error('The volume should be positive integer!');
        }

        let checkExistance = await Promise.all([
            AccountManager.getAccountByAid(transactionObj.giver),
            AccountManager.getAccountByAid(transactionObj.taker),
        ]);

        if (checkExistance[0] === null || checkExistance[1] === null) {
            throw new Error(`Giver or taker's aid is wrong!`);
        }

        return true;
    }

    //--------------- Mission ------------------

    static async #canManageMission(missionObj, clientEmail) {
        const account = await AccountManager.getAccountByAid(missionObj.client);

        if (account === null) {
            throw new Error(
                'There is no account whose aid is ' + missionObj.client
            );
        }

        if (account.email !== clientEmail) {
            throw new Error('You do not have permission for the client!');
        }

        if (account.authority < 10) {
            throw new Error('This account lacks authority to manage missions!');
        }

        return true;
    }

    static async #canOpenMission(missionObj, clientEmail) {
        if (await this.#canManageMission(missionObj, clientEmail)) {
            const account = await AccountManager.getAccountByAid(
                missionObj.client
            );

            if (
                account.amount <
                missionObj.reward * missionObj.personnelLimit
            ) {
                throw new Error(
                    'This account lacks amount to create a mission!'
                );
            }

            return true;
        }
    }

    static async #canCompleteMission(mission, aid, clientEmail) {
        if (await this.#canManageMission(mission, clientEmail)) {
            const account = await AccountManager.getAccountByAid(aid);

            if (account === null) {
                throw new Error('There is no account whose aid is ' + aid);
            }

            return true;
        }
    }

    static async openNewMission(missionObj, clientEmail) {
        if (await this.#canOpenMission(missionObj, clientEmail)) {
            const result = await Promise.allSettled([
                MissionManager.createMission(missionObj),
                AccountManager.updateAmountByAid(
                    missionObj.client,
                    -(missionObj.reward * missionObj.personnelLimit)
                ),
            ]);
            const mid = result[0].value._id;
            await TransactionManager.createTransaction({
                    giver: missionObj.client,
                    taker: mid,
                    volume: missionObj.personnelLimit * missionObj.reward,
                    reason: `Open Mission - ${mid}`
                });
            return true;
        }
    }

    static async closeMissionByMid(mid, clientEmail) {
        const mission = await MissionManager.getMissionByMid(mid);
        if (await this.#canManageMission(mission, clientEmail)) {
            const remainedPot =
                (mission.personnelLimit - mission.completeAidArr.length) *
                mission.reward;
            if (remainedPot > 0) {
                await AccountManager.updateAmountByAid(
                    mission.client,
                    remainedPot
                );
            } else if (remainedPot < 0) {
                throw new Error(
                    'The pot cannot be negative! Something has been wrong!'
                );
            }
            await Promise.allSettled([
                TransactionManager.createTransaction({
                    giver: mid,
                    taker: mission.client,
                    volume: remainedPot,
                    reason: `Close Mission - ${mid}`
                }),
                MissionManager.closeMissionByMid(mid)
            ]);
        }
    }

    static async completeMissionByMid(mid, aid, clientEmail) {
        const mission = await MissionManager.getMissionByMid(mid);
        if (await this.#canCompleteMission(mission, aid, clientEmail)) {
            if (mission.completeAidArr.length + 1 === mission.personnelLimit) {
                // reach the limit
                MissionManager.closeMissionByMid(mid);
            } else if (
                mission.completeAidArr.length + 1 >
                mission.personnelLimit
            ) {
                throw new Error(
                    'The number of accounts that complete the mission cannot exceed the limit! Something has been wrong!'
                );
            }

            await Promise.allSettled([
                TransactionManager.createTransaction({
                    giver: mission.client,
                    taker: aid,
                    volume: mission.reward,
                    reason: `Mission Complete - ${mid}`
                }),
                MissionManager.addCompleteAidByMid(mid, aid),
                AccountManager.updateAmountByAid(aid, mission.reward),
            ]);
        }
    }

    static async getMissionsByEmail(email) {
        const accountArr = await AccountManager.getAccountsByEmail(email);
        const missionArr = (
            await Promise.allSettled(
                accountArr.map(async (account) => {
                    return await MissionManager.getMissionsByClient(
                        account.aid
                    );
                })
            )
        )[0].value;
        return missionArr;
    }
}

export {
    CoinDB,
    AccountManager,
    MissionManager,
    TransactionManager,
    CoinManager,
};
