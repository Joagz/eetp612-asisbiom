sudo service mosquitto stop
# Intentamos levantar el servidor MQTT

sudo service mosquitto start
sudo service mosquitto restart
mosquitto -c ./fingerprint_utils_cfg.txt &




