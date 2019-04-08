const axios = require("axios");
const Position = require("../models/Position");

/**
 * POST /api/evaluate
 */
exports.evaluate = async (req, res) => {
    const price = parseFloat(req.query.price);
    const openPositions = false;
    // const openPositions = await Position.getOpenPositions();

    if (openPositions) {
        axios
            .post("http://127.0.0.1:5000/api/evaluate-position", {
                price: price,
                current_position: currentPosition
            })
            .then(function(response) {
                res.send({
                    status: 200,
                    response: response.data
                });
            })
            .catch(function(error) {
                console.log(error);
            });
    } else {
        axios
            .post("http://127.0.0.1:5000/api/evaluate-price", {
                price
            })
            .then(function(response) {
                res.send({
                    status: 200,
                    response: response.data
                });
            })
            .catch(function(error) {
                console.log(error);
                res.send({ error: true });
            });
    }

};
