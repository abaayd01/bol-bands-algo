class PriceEvaluation:
    """
        Create an empty price evaluation
    """

    def __init__(self,
                 price=None,
                 date=None,
                 action=None,
                 entry_price=None,
                 exit_price=None,
                 stop_loss=None,
                 ):
        self.price = price
        self.date = date
        self.action = action
        self.entry_price = entry_price
        self.exit_price = exit_price
        self.stop_loss = stop_loss

    '''
        Maps all attrs to a JSON
    '''

    def get_as_dict(self):
        return {
            'price': self.price,
            'date': self.date,
            'action': self.action,
            'entry_price': self.entry_price,
            'exit_price': self.exit_price,
            'stop_loss': self.stop_loss,
        }

    @staticmethod
    def create_null_position_dict(price, date):
        return {
            'price': price,
            'date': date,
            'action': 'NO_ACTION',
            'entry_price': None,
            'exit_price': None,
            'stop_loss': None,
        }
