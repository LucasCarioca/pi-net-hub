FROM amd64/node:14 as builder

WORKDIR /app

COPY ./package*.json ./

RUN npm ci

COPY ./src ./src
COPY ./public ./public
COPY ./prod.env ./.env

RUN npm run build

FROM amd64/nginx

COPY --from=builder /app/build /usr/share/nginx/html

