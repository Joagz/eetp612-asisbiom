#ifndef MQTTUTILS_H
#define MQTTUTILS_H
#define mqttServer "192.168.100.50"
#define mqttPassword "12345"
#define mqttUser "FP_SENSOR"
#define mqttPort 1887

#include <stdint.h>

#define MQTT_TOPIC_SENSOR_IN "mqtt_sensor_in"
#define MQTT_TOPIC_SENSOR_OUT "mqtt_sensor_out"

typedef struct {
  int message_id;
  char *sensor_id;
  int action;
  int student_id;
} mqtt_message;

#define MQTT_ACTION_AUTH 0
#define MQTT_ACTION_REGISTER 1
#define MQTT_ACTION_CONFIRM 2
#define MQTT_ACTION_PING 3
#endif
