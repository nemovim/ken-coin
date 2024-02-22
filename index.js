import dotenv from 'dotenv';
import mongoose from 'mongoose';
import AccountManager from './lib/modules/accountManager.js';
import MissionManager from './lib/modules/missionManager.js';
import Transaction from './lib/models/transaction.js';

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
        const giver = transactionObj.giver;
        const taker = transactionObj.taker;
        const volume = Number(transactionObj.volume);

        await this.#checkTransaction(transactionObj);

        let transaction = new Transaction(transactionObj);

        return await Promise.all([
            transaction.save(),
            AccountManager.updateAmountByAid(giver, -volume),
            AccountManager.updateAmountByAid(taker, volume),
        ]);
    }

    static async #checkTransaction(transactionObj) {
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
    }

    static async getTransactions(date = new Date().toISOString()) {
        return await Transaction.find({
            createdAt: {
                $lt: date,
            },
        }).limit(10);
    }

    //--------------- Mission ------------------


}

export {
    CoinDB,
    AccountManager,
    MissionManager,
    CoinManager
}
