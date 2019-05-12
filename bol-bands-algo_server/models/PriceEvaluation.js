const mongoose = require('mongoose');

const priceEvaluationSchema = new mongoose.Schema(
	{
		action: String,
		price: Number,
		date: Date,
		entry_price: Number,
		exit_price: Number,
		stop_loss: Number
	},
	{timestamps: true, collection: 'priceEvaluations'}
);

priceEvaluationSchema.statics.createNullPriceEvaluation = function (price) {
	return new PriceEvaluation({
		action: 'NO_ACTION',
		price: price,
		date: null,
		entry_price: null,
		exit_price: null,
		stop_loss: null
	});
};

const PriceEvaluation = mongoose.model('PriceEvaluation', priceEvaluationSchema);

module.exports = PriceEvaluation;
