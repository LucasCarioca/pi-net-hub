FROM node:14 as builder-ui

WORKDIR /dashboard

COPY ./dashboard/package*.json ./

RUN npm ci

COPY ./dashboard/src ./src
COPY ./dashboard/public ./public
COPY ./dashboard/prod.env ./.env

RUN npm run build

FROM python

COPY ./requirements.txt ./
RUN pip3 install -r requirements.txt

COPY ./app ./app
COPY --from=builder-ui ./dashboard ./dashboard

CMD ["python", "/app/main.py"]




