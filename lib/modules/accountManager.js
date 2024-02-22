import Account from '../models/account.js';

export default class AccountManager {
    static async createAccount(accountObj) {
        const account = new Account({
            aid: accountObj.aid,
            email: accountObj.email || accountObj.aid,
            name: accountObj.name,
            groupArr: accountObj.groupArr || ['0'],
            authority: accountObj.authority || 0
        });

        return await account.save();
    }

    static async getAllAccounts() {
        return await Account.find({});
    }

    static async getAccountByAid(aid) {
        const account = await Account.findOne({
            aid,
        });
        return account;
    }

    static async getAccountsByEmail(email) {
        const accountArr = await Account.find({
            email,
        });
        return accountArr;
    }

    static async getAccountsByName(name) {
        const accountArr = await Account.find({
            name,
        });
        return accountArr;
    }

    static async setAmountByAid(aid, amount) {
        return await Account.updateOne(
            {
                aid,
            },
            { amount }
        );
    }

    static async updateAmountByAid(aid, volume) {
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

    static async findGroupsByAid(aid) {
        const account = await this.getAccountByAid(aid);
        return account.groupArr;
    }

    static async findMembersByAid(aid) {
        const members = await Account.find({
            groupArr: [aid],
        });

        return members;
    }

    static async findRoots() {
        const roots = await Account.find({
            groupArr: ['0'],
        });
        return roots;
    }

    // async findAllGroups(aid) {
    //     return (await this.findGroups(aid)).reduce(async (prev, group) => {
    //         return new Set([
    //             ...prev,
    //             group,
    //             ...(await this.findAllGroups(group)),
    //         ]);
    //     }, new Set());
    // }

}