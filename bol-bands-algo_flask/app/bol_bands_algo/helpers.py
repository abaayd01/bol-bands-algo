from .trade import Trade
from prettytable import PrettyTable
import numpy as np

# def test(curPriceData):
#     curClosePrice = df.iloc[i]["Close"]

#     curMovingAv = df.iloc[i]["ma"]
#     curStd = df.iloc[i]["std"]

#     curBolLower = df.iloc[i]["bol_lower"]
#     curBolUpper = df.iloc[i]["bol_upper"]

#     updateTrades(trades, curPriceData)

#     # upwards trend
#     if (curPriceData["ma_dy_smooth"] > 0.01):
#         # go long when the price hits the moving average, exit when it hits the upper BB
#         # if curClosePrice <= curMovingAv and not isTradeOpen(trades):
#             trades.append(Trade(curClosePrice, curBolUpper,
#                                 curMovingAv * 0.98, 'BUY', curPriceData["Date"]))

#     # downwards trend
#     if (curPriceData["ma_dy_smooth"] < -0.01):
#         # go short when the price hits the MA, exit when it hits the lower BB
#         if curClosePrice >= curMovingAv:
#             trades.append(Trade(curClosePrice, curBolLower,
#                                 curMovingAv * 1.02, 'SELL', curPriceData["Date"]))

def backTest(df):
    print('back testing...')
    halfDfLen = int(len(df) / 2)

    trades = []
    for i in range(len(df) - 365, len(df)):
        prevPriceData = df.iloc[i - 1]
        curPriceData = df.iloc[i]

        prevClosePrice = df.iloc[i - 1]["Close"]
        curClosePrice = df.iloc[i]["Close"]

        curMovingAv = df.iloc[i]["ma"]
        curStd = df.iloc[i]["std"]

        curBolLower = df.iloc[i]["bol_lower"]
        curBolUpper = df.iloc[i]["bol_upper"]

        updateTrades(trades, curPriceData)
        evaluateTrades(trades, curPriceData)

        if (curPriceData["ma_dy_smooth"] > 0.01) and not isTradeOpen(trades):
            # upwards trend mode
            # go long when the price hits the moving average, exit when it hits the upper BB
            if curClosePrice <= curMovingAv and not isTradeOpen(trades):
                trades.append(Trade(curClosePrice, curBolUpper,
                                    curMovingAv * 0.98, 'BUY', curPriceData["Date"]))

        if (curPriceData["ma_dy_smooth"] < -0.01) and not isTradeOpen(trades):
            # downwards trend mode
            # go short when the price hits the MA, exit when it hits the lower BB
            if curClosePrice >= curMovingAv:
                trades.append(Trade(curClosePrice, curBolLower,
                                    curMovingAv * 1.02, 'SELL', curPriceData["Date"]))

    netPercentageProfit = 0

    t = PrettyTable(
        ['Entry Date', 'Exit Date', 'Outcome', 'Action', 'Entry Price', 'Close Price', 'Profit'])
    winningTrades = PrettyTable(
        ['Entry Date', 'Exit Date', 'Outcome', 'Action', 'Entry Price', 'Close Price', 'Profit'])
    losingTrades = PrettyTable(
        ['Entry Date', 'Exit Date', 'Outcome', 'Action', 'Entry Price', 'Close Price', 'Profit'])

    for trade in trades:
        if (not trade.isOpen):
            t.add_row([trade.entry_date, trade.exit_date, trade.outcome, trade.action, trade.entry_price,
                       trade.close_price, trade.percentageProfit])
            netPercentageProfit += trade.percentageProfit

        if (not trade.isOpen and trade.outcome == 'win'):
            winningTrades.add_row([trade.entry_date, trade.exit_date, trade.outcome, trade.action, trade.entry_price,
                       trade.close_price, trade.percentageProfit])

        if (not trade.isOpen and trade.outcome == 'lose'):
            losingTrades.add_row([trade.entry_date, trade.exit_date, trade.outcome, trade.action, trade.entry_price,
                       trade.close_price, trade.percentageProfit])

    print('------ \nTrade Count:', len(trades))
    print('------ \n', netPercentageProfit)
    print('------ \nCumulative Profit', calculateCumulativeProfit(trades, 5000))
    print(t)
    # print(winningTrades)
    # print(losingTrades)


def calculateCumulativeProfit(trades, initialCapital):
    value = initialCapital

    for i in range(0, len(trades)):
        if not trades[i].isOpen:
            value += value * (trades[i].percentageProfit)

    return value


def isTradeOpen(trades):
    for i in range(0, len(trades)):
        if trades[i].isOpen:
            return True

    return False


def updateTrades(trades, curPriceData):
    curMovingAv = curPriceData["ma"]
    curBolLower = curPriceData["bol_lower"]
    curBolUpper = curPriceData["bol_upper"]
    curStd = curPriceData["std"]

    for i in range(0, len(trades)):
        if (trades[i].isOpen):
            if (trades[i].action == 'BUY'):
                newExit = curBolUpper
                newStopLoss = curMovingAv * 0.98
                trades[i].updateExitPrice(newExit)
                trades[i].updateStopLoss(newStopLoss)
            else:
                newExit = curBolLower
                newStopLoss = curMovingAv * 1.02
                trades[i].updateExitPrice(newExit)
                trades[i].updateStopLoss(newStopLoss)


def evaluateTrades(trades, curPriceData):
    for i in range(0, len(trades)):
        if (trades[i].isOpen):
            trades[i].evaluate(curPriceData["Close"], curPriceData["Date"])
