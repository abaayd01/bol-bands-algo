import pandas as pd
import numpy as np 

class CSVReader:
    def __init__(self, fileName):
        self.df = pd.read_csv(fileName)
        self.df["Close"] = self.df["price(USD)"]
        self.df["Date"] = self.df["date"]

        windowSize = 10 
        self.appendMovingAverage(windowSize)
        self.appendDiffMovingAverage()
        self.smoothDiffMovingAverage(windowSize)
        self.appendStdDev(windowSize)

        self.appendBolBands(2)

    def appendMovingAverage(self, windowSize):
        movingAverage = self.df["Close"].rolling(window=windowSize).mean()
        self.df = self.df.assign(ma=movingAverage)

    def appendDiffMovingAverage(self):
        ma_dy = np.diff(self.df["ma"])
        ma_dy = np.insert(ma_dy, 0, [ 0 ])
        self.df = self.df.assign(ma_dy=ma_dy)
    
    def smoothDiffMovingAverage(self, windowSize):
        smoothDiffMovingAverage = self.df["ma_dy"].rolling(window=windowSize).mean()
        self.df = self.df.assign(ma_dy_smooth=smoothDiffMovingAverage)

    def appendStdDev(self, windowSize):
        movingAverage = self.df["Close"].rolling(window=windowSize).std()
        self.df = self.df.assign(std=movingAverage)

    def appendBolBands(self, bolMult):
        self.df["bol_lower"] = self.df["ma"] - bolMult * self.df["std"]
        self.df["bol_upper"] = self.df["ma"] + bolMult * self.df["std"]