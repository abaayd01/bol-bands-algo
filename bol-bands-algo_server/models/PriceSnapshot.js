const mongoose = require('mongoose');

const priceSnapshotSchema = new mongoose.Schema(
	{
		date: Date,
		marketcap: Number,
		price: Number,
		volume: Number
	},
	{
		timestamps: true,
		collection: 'priceSnapshots'
	}
);

const PriceSnapshot = mongoose.model('PriceSnapshot', priceSnapshotSchema);

module.exports = PriceSnapshot;
