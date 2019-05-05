# build using full node image
FROM node:10 as dev

WORKDIR /server
ENV NODE_ENV development

COPY package.json /server/package.json

RUN npm install
COPY . /server
RUN npm run postinstall
CMD ["npm","run", "start:dev"]

# run using smaller alpine image
FROM node:lts-alpine as prod
WORKDIR /server
COPY --from=dev /server .
RUN npm prune --production
EXPOSE 8080
CMD ["npm","start"]
