from picamera import PiCamera
from time import sleep
import paho.mqtt.client as paho
from paho import mqtt
import requests
import os
import time

server_addr = "192.168.100.50"
server_port = "8089"
mqtt_port   = 1887
api_camera_upload_url = "http://" + server_addr + ":" + server_port + "/api/image/save"

client = paho.Client(client_id="", userdata=None, protocol=paho.MQTTv5)

camera = PiCamera()
camera.rotation=180

def on_message(client, userdata, msg):
    camera.capture("/home/pi/Proyect/image.jpg")

    # Decode the payload
    payload = msg.payload.decode('utf-8')

    while not os.path.exists("/home/pi/Proyect/image.jpg"):
        time.sleep(0.1)  # Sleep for a short time before checking again

    while os.path.getsize("/home/pi/Proyect/image.jpg") == 0:
        time.sleep(0.1)  # Sleep for a short time before checking again

    with open("/home/pi/Proyect/image.jpg", 'rb') as f:
        img_data = f.read()
    files = {"image": ("image.jpg", img_data)}
    r = requests.post(api_camera_upload_url+"/"+payload, files=files)
    if r.status_code == 201:
        print("Image uploaded successfully!")
    else:
        print(r.text)

client.connect(server_addr, mqtt_port)
client.subscribe("mqtt_sensor_cam")
client.on_message = on_message

print("starting loop\n")
client.loop_forever()
