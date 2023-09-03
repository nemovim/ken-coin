import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Account from './lib/models/account.js';
import Transaction from './lib/models/transaction.js';

dotenv.config();

class CoinManager {
    #uri;
    #db;

    constructor() {
        this.#uri = process.env.COIN_MONGO_URI;
    }

    async init() {
        try {
            this.#db = await mongoose.connect(this.#uri);

            return true;
        } catch (e) {
            throw new Error(e.message);
        }
    }

    async createAccount(aid, name, groupArr) {
        let account = new Account({
            aid,
            name,
            groupArr,
        });

        return await account.save();
    }

    async getAccountByAid(aid) {
        const account = await Account.findOne({
            aid,
        });

        return account;
    }

    async getAccountsByName(name) {
        const accountArr = await Account.find({
            name,
        });

        return accountArr;
    }

    async transactCoin(transactionObj) {
        const giver = transactionObj.giver;
        const taker = transactionObj.taker;
        const volume = Number(transactionObj.volume);

        await this.#checkTransaction(transactionObj);

        let transaction = new Transaction(transactionObj);

        return await Promise.all([
            transaction.save(),
            this.updateAmount(giver, -volume),
            this.updateAmount(taker, volume),
        ]);
    }

    async #checkTransaction(transactionObj) {

        if (Number(transactionObj.volume) <= 0 || !Number.isInteger(Number(transactionObj.volume))) {
            throw new Error("The volume should be positive integer!");
        }

        let checkExistance = await Promise.all([
            this.getAccountByAid(transactionObj.giver),
            this.getAccountByAid(transactionObj.taker),
        ]);

        if (checkExistance[0] === null || checkExistance[1] === null) {
            throw new Error(`Giver or taker's aid was wrong!`);
        }


    }

    async updateAmount(aid, volume) {
        return await Account.updateOne(
            {
                aid,
            },
            {
                $inc: {
                    amount: volume,
                },
            }
        );
    }

    async getTransactions(date = new Date().toISOString()) {
        return await Transaction.find({
            createdAt: {
                $lt: date,
            },
        }).limit(10);
    }

    async findAllGroups(aid) {
        return await this.findGroups(aid).reduce(async (prev, group) => {
            return new Set([
                ...prev,
                group,
                ...(await this.findAllGroups(group)),
            ]);
        }, new Set());
    }

    async findGroups(aid) {
        const account = await this.getAccount(aid);
        return account.groupArr;
    }

    // async findAllMembers(aid) {}
}

export default CoinManager;
