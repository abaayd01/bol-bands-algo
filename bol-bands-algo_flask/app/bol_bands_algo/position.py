import json


class Position:
    """
        Create an empty position
    """

    def __init__(self,
                 entry_price=None,
                 exit_price=None,
                 stop_loss=None,
                 action=None,
                 entry_date=None,
                 exit_date=None,
                 percentage_profit=None,
                 is_open=None,
                 outcome=None
                 ):

        self.entry_price = entry_price
        self.exit_price = exit_price
        self.stop_loss = stop_loss
        self.action = action
        self.entry_date = entry_date
        self.exit_date = exit_date
        self.percentage_profit = percentage_profit
        self.is_open = is_open
        self.outcome = outcome

    '''
        Load from position_json
    '''

    def load_json(self, position_json):
        self.entry_price = position_json['entry_price']
        self.exit_price = position_json['exit_price']  # the target sell price
        self.stop_loss = position_json['stop_loss']
        self.action = position_json['action']  # BUY or SELL
        self.entry_date = position_json['entry_date']
        self.exit_date = position_json['exit_date']
        self.percentage_profit = position_json['percentage_profit']
        self.is_open = position_json['is_open']
        self.outcome = position_json['outcome']

    '''
        Maps all attrs to a JSON
    '''

    def get_as_dict(self):
        return {
            'entry_price': self.entry_price,
            'exit_price': self.exit_price,
            'stop_loss': self.stop_loss,
            'action': self.action,
            'entry_date': self.entry_date,
            'exit_date': self.exit_date,
            'percentage_profit': self.percentage_profit,
            'is_open': self.is_open,
            'outcome': self.outcome
        }

    def update(self, last_price_data, stop_loss_percent):
        current_moving_average = last_price_data["ma"]
        current_bol_lower = last_price_data["bol_lower"]
        current_bol_upper = last_price_data["bol_upper"]

        if self.is_open:
            if self.action == 'BUY':
                new_exit_price = current_bol_upper
                new_stop_loss = current_moving_average * \
                    (1 - stop_loss_percent)
                self.exit_price = new_exit_price
                self.stop_loss = new_stop_loss
            else:
                new_exit_price = current_bol_lower
                new_stop_loss = current_moving_average * \
                    (1 + stop_loss_percent)
                self.exit_price = new_exit_price
                self.stop_loss = new_stop_loss

    def evaluate(self, price, date):
        if self.action == 'BUY':
            self.evaluate_buy(price, date)

        else:
            self.evaluate_sell(price, date)

        if not self.is_open:
            self.outcome = 'win' if self.percentage_profit > 0 else 'lose'

    def evaluate_buy(self, price, date):
        # if the new target exit price drops below the entry price
        # due to extreme trend movement.
        if self.exit_price <= self.entry_price:
            # close the trade at entry price
            self.close_position(date)
            self.percentage_profit = self.calculate_profit(
                self.entry_price, self.entry_price, self.action)

        else:
            # if we hit the exit price
            if price >= self.exit_price:
                # close the trade at exit price
                self.close_position(date)
                self.percentage_profit = self.calculate_profit(
                    self.entry_price, self.exit_price, self.action)

            # else if we hit the stop_loss
            elif price <= self.stop_loss:
                # close the trade at stop_loss price
                self.close_position(date)
                self.percentage_profit = self.calculate_profit(
                    self.entry_price, self.stop_loss, self.action)

    def evaluate_sell(self, price, date):
        # if the new target exit price exceeds the entry price
        # due to extreme trend movement.
        if self.exit_price >= self.entry_price:
            # close the trade at entry price
            self.close_position(date)
            self.percentage_profit = self.calculate_profit(
                self.entry_price, self.entry_price, self.action)

        else:
            # if we hit the exit price
            if price <= self.exit_price:
                # close the trade at exit price
                self.close_position(date)
                self.percentage_profit = self.calculate_profit(
                    self.entry_price, self.exit_price, self.action)

            # else if we hit the stop_loss
            elif price >= self.stop_loss:
                # close the trade at stop_loss price
                self.close_position(date)
                self.percentage_profit = self.calculate_profit(
                    self.entry_price, self.stop_loss, self.action)

    def close_position(self, date):
        self.is_open = False
        self.exit_date = date

    def calculate_profit(self, entry_price, close_price, action):
        self.close_price = close_price
        if action == 'BUY':
            profit = (close_price - entry_price) / entry_price
        else:
            profit = (entry_price - close_price) / entry_price

        return profit
