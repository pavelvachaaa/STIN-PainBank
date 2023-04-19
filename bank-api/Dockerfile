# První stage
FROM node:18.16.0-alpine AS builder
WORKDIR /
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Druhá stage
FROM node:18.16.0-alpine AS server
WORKDIR /app
COPY package* ./
RUN npm install --production
COPY --from=builder . .
COPY --from=builder ./dist ./dist

# TODO: Push to the private docker hub+ on pavel-vacha.cz

EXPOSE 4000
CMD ["npm", "start"]