FROM node:10

WORKDIR /server
ENV NODE_ENV development

COPY package.json /server/package.json

RUN npm install --production

COPY .env /app/.env
COPY . /server

RUN npm run postinstall

CMD ["npm","start"]

EXPOSE 8080
