#
# Builder stage.
# This state compile our TypeScript to get the JavaScript code
#
FROM node:19.4 AS builder

WORKDIR /usr/src/app
RUN mkdir GameOrchestrator
RUN mkdir DataSource

COPY GameOrchestrator/package*.json ./GameOrchestrator
COPY GameOrchestrator/tsconfig*.json ./GameOrchestrator
COPY GameOrchestrator/src ./GameOrchestrator/src
COPY DataSource/package*.json ./DataSource
COPY DataSource/tsconfig*.json ./DataSource
COPY DataSource/src ./DataSource/src

WORKDIR /usr/src/app/DataSource
RUN npm ci --quiet

WORKDIR /usr/src/app/GameOrchestrator
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

COPY GameOrchestrator/package*.json ./
RUN npm ci --quiet --only=production

## We just need the build to execute the command
COPY --from=builder /usr/src/app/GameOrchestrator/dist ./dist

CMD ["npm", "run", "start"]