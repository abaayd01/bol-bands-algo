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

		const priceEvaluation = flaskAppResponse.data;
		const newPriceEvaluation = new PriceEvaluation({...priceEvaluation});

		return await newPriceEvaluation.save();
	} catch (err) {
		console.log(err)
	}
};

exports.evaluatePrice = evaluatePrice;
