import fastapi
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import requests

app = FastAPI()

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
        "port": 8000,
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
        "port": 8000,
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
        "port": 8000,
        "location": "master-betroom",
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
        "port": 8000,
        "location": "guest-bedroom",
        "device": "Pi Zero W",
        "sensors": [
            "dht11"
        ],
        "roles": [
            "climate"
        ]
    },
]


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
def reboot_all_nodes():
    for node in network:
        requests.get(f"http://{node['name']}:{node['port']}/reboot")


# Update and reboot all nodes other than the hub
@app.get('/api/update-nodes')
def reboot_all_nodes():
    for node in network:
        requests.get(f"http://{node['name']}:{node['port']}/update")

# control nodes
@app.get('/api/nodes/{name}/{command}')
def reboot_all_nodes(name: str, command: str, response: fastapi.Response):
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

# Reboot the hub
@app.get('/api/reboot')
def reboot_all_nodes():
    os.system("sudo reboot")


# Update and reboot the hub
@app.get('/api/update')
def reboot_all_nodes():
    os.system("cd /home/pi/apps/server && git pull && cd dashboard && /usr/local/bin/npm run build")
    os.system("sudo reboot")


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, log_level="debug")
