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

const evaluatePosition = async position => {
	try {
		// const cryptoCompareResponse = await cryptoCompareInterface.fetchCurrentPrice();
		// const currentPrice = cryptoCompareResponse['USD'];
		const currentPrice = 170.95;

		const flaskAppResponse = await flaskAppInterface.evaluatePosition(
			currentPrice,
			position
		);

		const positionEvaluation = flaskAppResponse.data;
		// const newPositionEvaluation = new PriceEvaluation({...positionEvaluation});

		// return await newPriceEvaluation.save();
		// console.log('positionEvaluation', positionEvaluation);
		// console.log('currentPosition', position);
		// console.log('currentPosition', position);
		console.log('currentPosition', position);
		console.log('currentPrice', currentPrice);
		console.log('positionEvaluation', positionEvaluation);
		return positionEvaluation
	} catch (err) {
		console.log(err)
	}
};
exports.evaluatePosition = evaluatePosition;
