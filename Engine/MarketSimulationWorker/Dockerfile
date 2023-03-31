#
# Builder stage.
# This state compile our TypeScript to get the JavaScript code
#
FROM node:19.4 AS builder

WORKDIR /usr/src/app
RUN mkdir MarketSimulationWorker
RUN mkdir DataSource

COPY MarketSimulationWorker/package*.json ./MarketSimulationWorker
COPY MarketSimulationWorker/tsconfig*.json ./MarketSimulationWorker
COPY MarketSimulationWorker/src ./MarketSimulationWorker/src
COPY DataSource/package*.json ./DataSource
COPY DataSource/tsconfig*.json ./DataSource
COPY DataSource/src ./DataSource/src

WORKDIR /usr/src/app/DataSource
RUN npm ci --quiet

WORKDIR /usr/src/app/MarketSimulationWorker
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

COPY MarketSimulationWorker/package*.json ./
RUN npm ci --quiet --only=production

## We just need the build to execute the command
COPY --from=builder /usr/src/app/MarketSimulationWorker/dist ./dist

CMD ["npm", "run", "start"]