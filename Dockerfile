FROM python

RUN pip3 install fastapi uvicorn uvicorn[standard] requests

WORKDIR /app

COPY ./app ./

CMD ["python", "/app/main.py"]




