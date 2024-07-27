#ifndef MQTTUTILS_H
#define MQTTUTILS_H

#define mqttServer "192.168.100.50"
#define mqttPassword "12345"
#define mqttUser "FP_SENSOR"
#define mqttPort 1887

#include <stdint.h>
#include <PubSubClient.h>
#include <WiFiManager.h>
#include <WiFi.h>

#define MQTT_TOPIC_SENSOR_IN "mqtt_sensor_in"
#define MQTT_TOPIC_SENSOR_OUT "mqtt_sensor_out"

void callback_debug(char *topic, byte *payload, unsigned int length);
void callback_for_idinfo(char *topic, byte *payload, unsigned int length);
void initMqttClient();

typedef struct {
    uint32_t message_id;
    uint32_t sensor_id;
    uint32_t action;
    uint32_t student_id;
} mqtt_message;

#define MQTT_ACTION_AUTH 0
#define MQTT_ACTION_REGISTER 1
#define MQTT_ACTION_CONFIRM 2
#define MQTT_ACTION_PING 3

#endif
