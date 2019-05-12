const axios = require('axios');

const evaluatePrice = async price => {
	try {
		console.log('evaluating price');
		const response = await axios.post(
			`${process.env.FLASK_BASE_URL}/evaluate-price`,
			{
				price
			}
		);

		return {
			success: true,
			data: response.data
		}
	} catch (err) {
		console.log(err);
		return {
			success: false,
			data: null,
			err
		}
	}
};
exports.evaluatePrice = evaluatePrice;

const evaluatePosition = async (price, position) => {
	try {
		const response = await axios.post(
			`${process.env.FLASK_BASE_URL}/evaluate-position`,
			{
				price,
				position
			}
		);

		return {
			success: true,
			data: response.data
		}
	} catch (err) {
		console.log(err);
		return {
			success: false,
			data: null,
			err
		}
	}
};
exports.evaluatePosition = evaluatePosition;
