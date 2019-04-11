from flask import (Blueprint, request, jsonify)
from .database import get_db
from .bol_bands_algo import bol_bands_algo
import pymongo

bp = Blueprint('api', __name__, url_prefix='/api')


@bp.route('/evaluate-price', methods=('GET', 'POST'))
def evaluate_price():
    '''
        Logic:
            1. Write request price data to db
            2. Get the previous 20 periods price data from db (will include request data)
            3. Pass position and price data into test function
            4. Test function creates a DataFrame
            5. Append ma and bol bands to DF
            6. Evaluate position using current price data
    '''
    mongo = get_db()
    historical_price_data = mongo.db.priceSnapshots.find().sort(
        'date', pymongo.DESCENDING)[1:50]

    request_payload = request.get_json()
    current_price = request_payload['price']

    price_df = bol_bands_algo.create_df(historical_price_data)
    result = bol_bands_algo.evaluate_price(price_df, current_price)
    return jsonify(result)


@bp.route('/evaluate-position', methods=('GET', 'POST'))
def evaluate_position():
    mongo = get_db()
    historical_price_data = mongo.db.priceSnapshots.find().sort(
        'date', pymongo.DESCENDING)[1:50]

    request_payload = request.get_json()
    current_position = request_payload['current_position']
    current_price = request_payload['price']

    price_df = bol_bands_algo.create_df(historical_price_data)

    result = bol_bands_algo.evaluate_position(
        price_df, current_price, current_position)

    return jsonify(result)


@bp.route('/test', methods=('GET'))
def test():
    return {
        'message': 'hello from flask!'
    }