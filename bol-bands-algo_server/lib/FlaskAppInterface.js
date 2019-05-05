const axios = require('axios')

const evaluatePrice = async price => {
  try {
    const response = await axios.post(
      `${process.env.FLASK_BASE_URL}/evaluate-price`,
      {
        price
      }
    )

    return {
      success: true,
      data: response.data
    }
  } catch (err) {
    console.log(error)
    return {
      success: false,
      data: null,
      error
    }
  }
}

exports.evaluatePrice = evaluatePrice
