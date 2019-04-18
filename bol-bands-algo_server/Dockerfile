# build using full node image
FROM node:10 as build-stage

WORKDIR /server
ENV NODE_ENV development

COPY package.json /server/package.json

RUN npm install --production
RUN npm run postinstall

# run using smaller alpine image
FROM node:lts-alpine as run-stage
WORKDIR /server
COPY --from=build-stage /server . 
EXPOSE 8080
CMD ["npm","start"]
