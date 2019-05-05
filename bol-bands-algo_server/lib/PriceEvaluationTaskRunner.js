const cryptoCompareInterface = require('@lib/CryptoCompareInterface')
const flaskAppInterface = require('@lib/FlaskAppInterface')
const PriceEvaluation = require('@models/PriceEvaluation')

const evaluatePrice = async () => {
  try {
    const cryptoCompareResponse = await cryptoCompareInterface.fetchCurrentPrice()
    const currentPrice = cryptoCompareResponse['USD']
    const flaskAppResponse = await flaskAppInterface.evaluatePrice(
      currentPrice
    )

    const priceEvaluation = flaskAppResponse.data

    if (priceEvaluation !== null) {
      newPriceEvaluation = new PriceEvaluation({ ...priceEvaluation })
      newPriceEvaluation.save(error => {
        if (error) {
          return error
        } else {
          console.log('price evaluation saved!')
          console.log(newPriceEvaluation)
        }
      })
    } else {
      console.log('no action')
    }
  } catch (err) {
    console.log(err)
  }
}

exports.evaluatePrice = evaluatePrice
