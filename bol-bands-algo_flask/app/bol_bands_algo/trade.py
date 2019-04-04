class Trade:
    def __init__(self, entry_price, exit_price, stop_loss, action,  entry_date):
        self.entry_price = entry_price
        self.exit_price = exit_price  # the target sell price
        self.stop_loss = stop_loss
        self.action = action  # BUY or SELL

        self.entry_date = entry_date
        self.exit_date = None

        self.percentageProfit = 0
        self.isOpen = True
        self.outcome = None

    def updateExitPrice(self, exit_price):
        self.exit_price = exit_price

    def updateStopLoss(self, stop_loss):
        self.stop_loss = stop_loss

    def evaluate(self, price, date):
        if (self.action == 'BUY'):
            self.evaluateBuy(price, date)

        else:
            self.evaluateSell(price, date)

        self.outcome = 'win' if self.percentageProfit > 0 else 'lose'

    def evaluateBuy(self, price, date):
        # if the new target exit price drops below the entry price
        # due to extreme trend movement.
        if (self.exit_price <= self.entry_price):
            # close the trade at entry price
            self.closeTrade(date)
            self.percentageProfit = self.calculateProfit(
                self.entry_price, self.entry_price, self.action)

        else:
            # if we hit the exit price
            if (price >= self.exit_price):
                # close the trade at exit price
                self.closeTrade(date)
                self.percentageProfit = self.calculateProfit(
                    self.entry_price, self.exit_price, self.action)

            # else if we hit the stop_loss
            elif (price <= self.stop_loss):
                # close the trade at stop_loss price
                self.closeTrade(date)
                self.percentageProfit = self.calculateProfit(
                    self.entry_price, self.stop_loss, self.action)

    def evaluateSell(self, price, date):
        # if the new target exit price exceeds the entry price
        # due to extreme trend movement.
        if (self.exit_price >= self.entry_price):
            # close the trade at entry price
            self.closeTrade(date)
            self.percentageProfit = self.calculateProfit(
                self.entry_price, self.entry_price, self.action)

        else:
            # if we hit the exit price
            if (price <= self.exit_price):
                # close the trade at exit price
                self.closeTrade(date)
                self.percentageProfit = self.calculateProfit(
                    self.entry_price, self.exit_price, self.action)

            # else if we hit the stop_loss
            elif (price >= self.stop_loss):
                # close the trade at stop_loss price
                self.closeTrade(date)
                self.percentageProfit = self.calculateProfit(
                    self.entry_price, self.stop_loss, self.action)

    def closeTrade(self, date):
        self.isOpen = False
        self.exit_date = date

    def calculateProfit(self, entry_price, close_price, action):
        if (action == 'BUY'):
            profit = (close_price - entry_price) / entry_price
            self.close_price = close_price
        else:
            profit = (entry_price - close_price) / entry_price
            self.close_price = close_price

        return profit