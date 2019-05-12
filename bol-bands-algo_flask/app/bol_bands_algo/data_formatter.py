import pandas as pd
import numpy as np


def format_data(data_frame):
    window_size = 10
    bol_multiplier = 2

    data_frame = append_moving_average(data_frame, window_size)
    data_frame = append_moving_average_diff(data_frame)
    data_frame = smooth_moving_average_diff(data_frame, window_size)
    data_frame = append_std_dev(data_frame, window_size)
    data_frame = append_bol_bands(data_frame, bol_multiplier)

    return data_frame


def append_moving_average(data_frame, window_size):
    movingAverage = data_frame["price"].rolling(window=window_size).mean()
    data_frame = data_frame.assign(ma=movingAverage)
    return data_frame


def append_moving_average_diff(data_frame):
    ma_dy = np.diff(data_frame["ma"])
    ma_dy = np.insert(ma_dy, 0, [0])
    data_frame = data_frame.assign(ma_dy=ma_dy)
    return data_frame


def smooth_moving_average_diff(data_frame, window_size):
    smoothDiffMovingAverage = data_frame["ma_dy"].rolling(window=window_size).mean()
    data_frame = data_frame.assign(ma_dy_smooth=smoothDiffMovingAverage)
    return data_frame


def append_std_dev(data_frame, window_size):
    movingAverage = data_frame["price"].rolling(window=window_size).std()
    data_frame = data_frame.assign(std=movingAverage)
    return data_frame


def append_bol_bands(data_frame, bol_multiplier):
    data_frame["bol_lower"] = data_frame["ma"] - bol_multiplier * data_frame["std"]
    data_frame["bol_upper"] = data_frame["ma"] + bol_multiplier * data_frame["std"]
    return data_frame
