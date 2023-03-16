#
# Builder stage.
# This state compile our TypeScript to get the JavaScript code
#
FROM node:19.4 AS builder

WORKDIR /usr/src/app
RUN mkdir AssetHealth
RUN mkdir DataSource

COPY AssetHealth/package*.json ./AssetHealth
COPY AssetHealth/tsconfig*.json ./AssetHealth
COPY AssetHealth/src ./AssetHealth/src
COPY AssetHealth/static ./AssetHealth/static
COPY DataSource/package*.json ./DataSource
COPY DataSource/tsconfig*.json ./DataSource
COPY DataSource/src ./DataSource/src

WORKDIR /usr/src/app/DataSource
RUN npm ci --quiet

WORKDIR /usr/src/app/AssetHealth
RUN rm ./src/.env
RUN mv ./src/.env-docker ./src/.env
RUN npm ci --quiet && npm run build

#
# Production stage.
# This state compile get back the JavaScript code from builder stage
# It will also install the production package only
#
FROM node:19.4-alpine

WORKDIR /app
ENV NODE_ENV=production

COPY AssetHealth/package*.json ./
RUN npm ci --quiet --only=production

EXPOSE 40003

## We just need the build to execute the command
COPY --from=builder /usr/src/app/AssetHealth/dist ./dist

CMD ["npm", "run", "start"]