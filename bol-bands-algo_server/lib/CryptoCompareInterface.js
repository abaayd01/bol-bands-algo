const axios = require('axios');
const PriceSnapshot = require('@models/PriceSnapshot');

const fetchCurrentPrice = async () => {
	try {
		const response = await axios.get(
			`${process.env.CRYPTO_COMPARE_URL}/price?fsym=ETH&tsyms=USD`
		);
		console.log(response.data);
		return response.data
	} catch (err) {
		console.error(err);
		return err;
	}
};
exports.fetchCurrentPrice = fetchCurrentPrice;

const takeSnapshot = async () => {
	const snapshotData = await fetchCurrentPrice();
	const price = snapshotData['USD'];

	const newPriceSnapshot = new PriceSnapshot({
		date: Date.now(),
		marketcap: null,
		price,
		volume: null
	});

	newPriceSnapshot.save(error => {
		if (error) {
			return error
		}
	})
};
exports.takeSnapshot = takeSnapshot;

const fetchHistoricalDailyPriceData = async countOfRecords => {
	try {
		const response = await axios.get(
			`${process.env.CRYPTO_COMPARE_URL}/histoday?fsym=ETH&tsym=USD&limit=${countOfRecords}`
		);

		return response.data
	} catch (err) {
		console.error(err);
		return err;
	}
};
exports.fetchHistoricalDailyPriceData = fetchHistoricalDailyPriceData;
