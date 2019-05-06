const mongoose = require('mongoose');

const priceEvaluationSchema = new mongoose.Schema(
	{
		action: String,
		eval_price: Number,
		entry_date: Date,
		entry_price: Number,
		exit_date: Number,
		exit_price: Number,
		is_open: Boolean,
		outcome: String,
		percentage_profit: Number,
		stop_loss: Number
	},
	{timestamps: true, collection: 'priceEvaluations'}
);

const PriceEvaluation = mongoose.model('PriceEvaluation', priceEvaluationSchema);

module.exports = PriceEvaluation;
