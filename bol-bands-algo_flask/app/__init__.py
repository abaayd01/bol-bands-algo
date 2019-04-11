import os

from flask import Flask


def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)

    is_prod = os.environ.getenv('IS_HEROKU', None)

    if is_prod:
        app.config.from_mapping(
            SECRET_KEY='dev',
            MONGO_URI=os.environ.get('MONGO_URI')
        )
    else:
        app.config.from_mapping(
            SECRET_KEY='dev',
            MONGO_URI="mongodb://localhost:27017/bolBandsDB"
        )

    # mongo = PyMongo(app)

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    from . import api
    app.register_blueprint(api.bp)

    return app
