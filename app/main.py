import fastapi
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import requests
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from starlette.exceptions import HTTPException

app = FastAPI()
app.mount("/static", StaticFiles(directory="./dashboard/build/static"), name="frontend-app")
templates = Jinja2Templates(directory="./dashboard/build")


@app.route("/")
async def catch_all(request: fastapi.Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.exception_handler(HTTPException)
async def catch_all(request: fastapi.Request, exception: HTTPException):
    if exception.status_code == 404:
        return templates.TemplateResponse("index.html", {"request": request})
    return JSONResponse(
        status_code=exception.status_code,
        content={"message": f"{exception.status_code}: {exception.detail}"},
    )


origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

network = [
    {
        "node": "Living Room",
        "name": "piz01",
        "location": "living-room",
        "device": "Pi Zero W",
        "sensors": [
            "dht22"
        ],
        "roles": [
            "climate"
        ]
    },
    {
        "node": "Office",
        "name": "piz02",
        "location": "office",
        "device": "Pi Zero",
        "sensors": [
            "dht22"
        ],
        "roles": [
            "climate"
        ]
    },
    {
        "node": "Master Bedroom",
        "name": "piz03",
        "location": "master-room",
        "device": "Pi Zero W",
        "sensors": [
            "dht22"
        ],
        "roles": [
            "climate"
        ]
    },
    {
        "node": "Guest Bedroom",
        "name": "piz04",
        "location": "guest-room",
        "device": "Pi Zero W",
        "sensors": [
            "dht11"
        ],
        "roles": [
            "climate"
        ]
    },
]


@app.get("/api/v1/health")
def health():
    return {
        "message": "up"
    }


@app.get("/api")
def get_node_info():
    return {"server": "pinet-hub", "nodes": network}


@app.get("/api/climate")
def get_network_climate_info():
    response = []
    for node in network:
        if "climate" in node['roles']:
            try:
                results = requests.get(f"http://{node['name']}:{node['port']}/climate")
                if results.status_code == 200:
                    data = results.json()
                    response.append({
                        "node": node['node'],
                        "name": node['name'],
                        "location": node['location'],
                        "temp": data['temp'],
                        "humidity": data['humidity']
                    })
            except:
                print("failed to load")
    return response


# Reboot all nodes other than the hub
@app.get('/api/reboot-nodes')
def reboot_nodes():
    for node in network:
        requests.get(f"http://{node['name']}:{node['port']}/reboot")


# Update and reboot all nodes other than the hub
@app.get('/api/update-nodes')
def update_nodes():
    for node in network:
        requests.get(f"http://{node['name']}:{node['port']}/update")


# control nodes
@app.get('/api/nodes/{name}/{command}')
def command_nodes(name: str, command: str, response: fastapi.Response):
    for node in network:
        if node['name'] == name:
            try:
                results = requests.get(f"http://{node['name']}:{node['port']}/{command}", timeout=10)
                print(results)
                return results.json()
            except:
                response.status_code = fastapi.status.HTTP_404_NOT_FOUND
                return {
                    "message": f"server {name} not found"
                }


# control nodes
@app.get('/api/piz/{name}')
def read_node(name: str, response: fastapi.Response):
    try:
        results = requests.get(f"http://192.168.1.211/api/v1/climate-records?field=node&value={name}&last=true",
                               timeout=10)
        print(results)
        return results.json()
    except:
        response.status_code = fastapi.status.HTTP_404_NOT_FOUND
        return {
            "message": f"server {name} not found"
        }


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, log_level="debug")
