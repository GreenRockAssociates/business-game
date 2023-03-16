### STAGE 1: Build ###
FROM node:19.4-alpine AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN apk update && apk add --no-cache --virtual .gyp \
        python3 \
        make \
        g++ \
    && npm ci \
    && apk del .gyp
COPY . .
RUN npm run build --prod

### STAGE 2: Run ###
FROM nginx:stable-alpine
COPY --from=build /usr/src/app/dist/green-rock-frontend /usr/share/nginx/html
