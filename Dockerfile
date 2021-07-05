FROM node:14 as builder-ui

WORKDIR /dashboard

COPY ./dashboard/package*.json ./

RUN npm ci

COPY ./dashboard/src ./src
COPY ./dashboard/public ./public
COPY ./dashboard/prod.env ./.env

RUN npm run build

FROM python

RUN pip3 install fastapi uvicorn uvicorn[standard] requests

WORKDIR /app

COPY ./app ./
COPY --from=builder-ui ./dashboard ./app/

CMD ["python", "/app/main.py"]




