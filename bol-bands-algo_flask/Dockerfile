FROM python:3.6 as base

# Create app directory
WORKDIR /bol-bands-algo_flask

# Install app dependencies
COPY requirements.txt ./

RUN pip install -r requirements.txt

# Bundle app source
COPY app /bol-bands-algo_flask/app

FROM base as dev
RUN export FLASK_APP=app && export FLASK_ENV=development
EXPOSE 5000
CMD ["flask", "run", "--host=0.0.0.0"]

FROM dev as prod
EXPOSE 8000
CMD ["gunicorn", "-b","0.0.0.0:8000", "app:create_app()"]
