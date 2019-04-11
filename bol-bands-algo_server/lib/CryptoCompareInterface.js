const axios = require("axios");
const PriceSnapshot = require("@models/PriceSnapshot");

const fetchCurrentPrice = async () => {
    try {
        response = await axios.get(
            `${process.env.CRYPTO_COMPARE_URL}/price?fsym=ETH&tsyms=USD`
        );
        console.log(response.data);
        return response.data;
    } catch (err) {
        console.error(err);
        return err;
    }
};
exports.fetchCurrentPrice = fetchCurrentPrice;

const takeSnapshot = async () => {
    snapshotData = await fetchCurrentPrice();
    const price = snapshotData["USD"];

    const newPriceSnapshot = new PriceSnapshot({
        date: Date.now(),
        marketcap: null,
        price,
        volume: null
    });

    newPriceSnapshot.save(error => {
        if (error) {
            return error;
        }
    });
}; 

exports.takeSnapshot = takeSnapshot;