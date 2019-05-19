import datetime
import pandas as pd
from .data_formatter import format_data
from .position import Position
from .price_evaluation import PriceEvaluation
from enum import Enum


class Trend(Enum):
    NONE = 0
    UP = 1
    DOWN = 2


stop_loss_percent = 0.02


def create_df(price_data):
    price_df = pd.DataFrame(list(price_data))
    price_df = format_data(price_df)
    return price_df


def evaluate_price(price_df, current_price):
    last_price_data = price_df.iloc[-1]

    last_moving_ave = last_price_data["ma"]
    last_moving_ave_smooth = last_price_data["ma_dy_smooth"]

    # print ('Trend', get_trend(last_moving_ave_smooth))
    # print (last_price_data['bol_upper'])
    # print (last_price_data['bol_lower'])
    last_ma_dy = last_price_data["ma_dy"]
    # print('last_price_data')
    # print(last_price_data)

    if get_trend(last_moving_ave_smooth) == Trend.UP:
        # upwards trend mode
        # go long when the price hits the moving average, exit when it hits the upper BB
        if current_price <= last_moving_ave:
            price_evaluation = PriceEvaluation(
                price=current_price,
                date=datetime.datetime.now(),
                action='BUY',
                entry_price=current_price,
                exit_price=last_price_data["bol_upper"],
                stop_loss=last_moving_ave * (1 - stop_loss_percent),
            )
            return price_evaluation.get_as_dict()

    if get_trend(last_moving_ave_smooth) == Trend.DOWN:
        # downwards trend mode
        # go short when the price hits the MA, exit when it hits the lower BB
        if current_price >= last_moving_ave:
            price_evaluation = PriceEvaluation(
                price=current_price,
                date=datetime.datetime.now(),
                action='SELL',
                entry_price=current_price,
                exit_price=last_price_data["bol_lower"],
                stop_loss=last_moving_ave * (1 + stop_loss_percent),
            )
            return price_evaluation.get_as_dict()

    return PriceEvaluation.create_null_position_dict(current_price, datetime.datetime.now())


def evaluate_position(price_df, current_price, current_position_json):
    position = Position()
    position.load_json(current_position_json)

    last_price_data = price_df.iloc[-1]
    position.update(last_price_data, stop_loss_percent)
    position.evaluate(current_price, datetime.datetime.now())
    return position.get_as_dict()


def get_trend(current_moving_ave_smooth):
    if current_moving_ave_smooth > 0.01:
        return Trend.UP
    if current_moving_ave_smooth < -0.01:
        return Trend.DOWN

    return Trend.NONE
