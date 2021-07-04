FROM node:14 as builder

WORKDIR /app

COPY ./package*.json ./

RUN npm ci

COPY ./src ./src
COPY ./public ./public

RUN npm run build

FROM nginx

COPY --from=builder /app/build /usr/share/nginx/html

