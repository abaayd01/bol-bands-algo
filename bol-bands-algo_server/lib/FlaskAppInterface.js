const axios = require('axios');

const evaluatePrice = async price => {
	try {
		const response = await axios.post(
			`${process.env.FLASK_BASE_URL_DEV}/evaluate-price`,
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
			error
		}
	}
}

exports.evaluatePrice = evaluatePrice;
