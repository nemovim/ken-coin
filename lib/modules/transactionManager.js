import Transaction from '../models/transaction.js';

export default class TransactionManager {
    static async createTransaction(transactionObj) {
        const transaction = new Transaction(transactionObj);
        return await transaction.save();
    }

    static async getTransactions(date = new Date().toISOString()) {
        return await Transaction.find({
            createdAt: {
                $lt: date,
            },
        }).limit(10);
    }

}