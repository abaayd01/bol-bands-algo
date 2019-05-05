const axios = require('axios')
const Position = require('../models/Position')
const PriceSnapshot = require('@models/PriceSnapshot')
const cryptoCompareInterface = require('@lib/CryptoCompareInterface')

exports.test = async (req, res) => {
  res.send({
    message: 'hello from nodejs'
  })
}

/**
 * POST /api/evaluate
 */
exports.evaluate = async (req, res) => {
  const price = parseFloat(req.query.price)
  const openPositions = false
  // const openPositions = await Position.getOpenPositions();

  if (openPositions) {
    axios
      .post(`${process.env.FLASK_BASE_URL}/evaluate-position`, {
        price: price,
        current_position: currentPosition
      })
      .then(function (response) {
        res.send({
          status: 200,
          response: response.data
        })
      })
      .catch(function (error) {
        console.log(error)
      })
  } else {
    axios
      .post(`${process.env.FLASK_BASE_URL}/evaluate-price`, {
        price
      })
      .then(function (response) {
        res.send({
          status: 200,
          response: response.data
        })
      })
      .catch(function (error) {
        console.log(error)
        res.send({ error: true })
      })
  }
}

exports.snapshot = async (req, res) => {
  snapshotData = await cryptoCompareInterface.fetchCurrentPrice()
  const price = snapshotData['USD']

  const newPriceSnapshot = new PriceSnapshot({
    date: Date.now(),
    marketcap: null,
    price,
    volume: null
  })

  newPriceSnapshot.save(error => {
    if (error) {
      res.send({
        success: false,
        error
      })
    } else {
      res.send({
        success: true
      })
    }
  })
}
