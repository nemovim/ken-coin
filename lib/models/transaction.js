import mongoose from 'mongoose';

const SCHEMA = new mongoose.Schema(
    {
        giver: { type: String, required: true},
        taker: { type: String, required: true},
        volume: { type: Number, required: true, min: 1},
        reason: { type: String, default: '' },
        memo: { type: String, default: '' },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Transaction', SCHEMA);
