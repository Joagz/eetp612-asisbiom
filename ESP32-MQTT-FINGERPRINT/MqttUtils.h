
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
#define MQTT_TOPIC_IMAGE_CAPTURE "mqtt_sensor_cam"
typedef struct {
    uint32_t message_id;
    uint32_t sensor_id;
    uint32_t action;
    uint32_t student_id;
} mqtt_message;

#define MQTT_ACTION_AUTH                  0x00
#define MQTT_ACTION_REGISTER              0x01
#define MQTT_ACTION_CONFIRM               0x02
#define MQTT_ACTION_PING                  0x03
#define MQTT_ACTION_PUT_FINGER            0x04
#define MQTT_ACTION_REMOVE_FINGER         0x05

#define MQTT_ACTION_COMPLETED             0x06
#define MQTT_ACTION_CONFIRMATION_COMPLETE 0x07
#define MQTT_ACTION_REGISTER_COMPLETE     0x08

#define MQTT_ERROR_AUTH_FAILED            0xF0
#define MQTT_ERROR_REGISTER_FAILED        0xF1
#define MQTT_ERROR_CONFIRM_FAILED         0xF2


#endif
