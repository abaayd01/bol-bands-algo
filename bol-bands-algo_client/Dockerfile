# base stage
FROM node:lts-alpine as base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# dev stage
FROM base as dev
CMD ["npm", "run", "serve"]


# build stage
FROM base as build
RUN npm run build

# production stage
FROM nginx:stable-alpine as prod
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]