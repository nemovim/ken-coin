import mongoose from 'mongoose';

const SCHEMA = new mongoose.Schema(
    {
        giver: { type: String, required: true},
        taker: { type: String, required: true},
        memo: { type: String, default: '' },
        volume: { type: Number, required: true, min: 1},
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Transaction', SCHEMA);
