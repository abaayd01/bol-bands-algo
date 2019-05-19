from database import get_db
from bol_bands_algo import bol_bands_algo
from pymongo import MongoClient
import pymongo

mongo = MongoClient('localhost', 27017)
historical_price_data = mongo.bolBandsDB.priceSnapshots.find().sort(
    'date', pymongo.DESCENDING)[1:50]
# print(historical_price_data)
price_df = bol_bands_algo.create_df(historical_price_data)
# print(price_df[['ma_dy', 'date']].head(50))
result = bol_bands_algo.evaluate_price(price_df, 200)
print(price_df.iloc[-1])
print(result)
