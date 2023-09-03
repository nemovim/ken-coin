import mongoose from 'mongoose';

const SCHEMA = new mongoose.Schema(
    {
        aid: { type: String, required: true, unique: true, validate: /^.+$/ },
        name: { type: String, required: true, validate: /^.+$/ },
        amount: { type: Number, default: 0},
        groupArr: { type: [String], default: []},
        state: { type: Boolean, default: true },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Account', SCHEMA);
