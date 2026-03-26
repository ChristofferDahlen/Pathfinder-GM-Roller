FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run generate

# Export stage — just holds the built output
FROM scratch
COPY --from=builder /app/.output/public /public
