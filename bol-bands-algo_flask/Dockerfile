FROM python:3.6

# Create app directory
WORKDIR /bol-bands-algo_flask

# Install app dependencies
COPY requirements.txt ./

RUN pip install -r requirements.txt

# Bundle app source
COPY app /bol-bands-algo_flask/app

RUN export FLASK_APP=app && export FLASK_ENV=development
EXPOSE 5000
CMD ["flask", "run","--host=0.0.0.0"]
