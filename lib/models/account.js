import mongoose from 'mongoose';

const SCHEMA = new mongoose.Schema(
    {
        aid: { type: String, required: true, unique: true, validate: /^.+$/ },
        email: { type: String, required: true, unique: true, validate: /^.+$/ },
        name: { type: String, required: true, validate: /^.+$/ },
        amount: { type: Number, default: 0},
        groupArr: { type: [String], default: []},
        authority: { type: Number, default: 0},
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Account', SCHEMA);
