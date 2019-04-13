const mongoose = require('mongoose');

const positionSchema = new mongoose.Schema({
    entry_price: Number,
    exit_price: Number,
    stop_loss: Number,
    action: String,
    entry_date: Date,
    exit_date: Date,
    percentage_profit: Number,
    is_open: Boolean,
    outcome: String,
}, { timestamps: true });


positionSchema.statics.getOpenPositions = async function () {
    const openPositions = this.find({ is_open: true });

    if (openPositions.length == 0) {
        return null;
    }

    return openPositions;
};

const Position = mongoose.model('Position', positionSchema, 'positions');

module.exports = Position;
