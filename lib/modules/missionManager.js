import Mission from '../models/mission.js';

export default class MissionManager {
    static async createMission(missionObj) {
        const mission = new Mission({
            client: missionObj.client,
            title: missionObj.title,
            content: missionObj.content,
            deadline: missionObj.deadline || 0,
            reward: missionObj.reward,
            personnelLimit: missionObj.personnelLimit,
        });

        return await mission.save();
    }

    static async getAllMissions() {
        return await Mission.find({});
    }

    static async getAllOpenMissions() {
        return await Mission.find({
            deadline: {
                $or: [
                    {
                        $gt: new Date.getTime(),
                    },
                    0,
                ],
            },
        });
    }

    static async getMissionByMid(mid) {
        const mission = await Mission.findById(mid);
        return mission;
    }

    static async closeMissionByMid(mid) {
        return await Mission.findByIdAndUpdate(mid, {
            $set: {
                deadline: -1,
            },
        });
    }

    static async addCompleteAidByMid(mid, aid) {
        return await Mission.findByIdAndUpdate(mid, {
            $push: {
                completeAidArr: aid,
            },
        });
    }
}
