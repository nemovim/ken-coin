import mongoose from 'mongoose';

const SCHEMA = new mongoose.Schema(
    {
        client: { type: String, required: true, validate: /^.+$/ },
        title: { type: String, required: true, validate: /^.+$/ },
        content: { type: String, default: '', validate: /^.*$/ },
        reward: { type: Number, required: true},
        personnelLimit: { type: Number, required: true},
        completeAidArr: { type: [String], default: []},
        state: { type: String, default: 'open'},
        // deadline: { type: Number, required: true},
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Mission', SCHEMA);
