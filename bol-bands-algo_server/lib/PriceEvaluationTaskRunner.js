const cryptoCompareInterface = require('@lib/CryptoCompareInterface');
const flaskAppInterface = require('@lib/FlaskAppInterface');
const PriceEvaluation = require('@models/PriceEvaluation');

const evaluatePrice = async () => {
	try {
		const cryptoCompareResponse = await cryptoCompareInterface.fetchCurrentPrice();
		const currentPrice = cryptoCompareResponse['USD'];
		const flaskAppResponse = await flaskAppInterface.evaluatePrice(
			currentPrice
		);

		console.log('flaskAppResponse', flaskAppResponse);
		const priceEvaluation = flaskAppResponse.data;

		if (priceEvaluation !== null) {
			let newPriceEvaluation = new PriceEvaluation({...priceEvaluation});
			newPriceEvaluation.save(error => {
				if (error) {
					return error
				} else {
					console.log('price evaluation saved!');
					console.log(newPriceEvaluation)
				}
			})
		} else {
			console.log('no action');
			// let newPriceEvaluation = new PriceEvaluation({
			// 	action: 'NO_ACTION',
			// 	eval_price: currentPrice,
			// 	entry_date: null,
			// 	entry_price: null,
			// 	exit_date: null,
			// 	exit_price: null,
			// 	is_open: false,
			// 	outcome: null,
			// 	percentage_profit: null,
			// 	stop_loss: null
			// });
			// newPriceEvaluation.save(error => {
			// 	if (error) {
			// 		return error
			// 	} else {
			// 		console.log('no action price evaluation saved!');
			// 		console.log(newPriceEvaluation)
			// 	}
			// })
		}
	} catch (err) {
		console.log(err)
	}
};

exports.evaluatePrice = evaluatePrice;
