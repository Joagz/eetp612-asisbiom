#include "MqttUtils.h"
#include "ServerUtils.h"

PubSubClient client;
WiFiClient espClient;

void mqttClientLoop() {
  client.loop();
}

void init_mqtt_service() {
    client.setClient(espClient);
    client.setServer(mqttServer, mqttPort);
    client.setCallback(callback_for_idinfo);
    // client.setCallback(callback_debug);

    while (!client.connected()) {
        if (client.connect("ESP32Client", mqttUser, mqttPassword)) {
            break;
        }
    }

    client.subscribe(MQTT_TOPIC_SENSOR_IN);
}

void callback_for_idinfo(char *topic, byte *payload, unsigned int length) {

    char values[4][16] = { { '\0' }, { '\0' }, { '\0' }, { '\0' } };  //64bytes

    // Extraer el mensaje y formatearlo, colocarlo dentro de 'values'
    for (int i = 0, k = 0, j = 0; i < length; i++) {
        if ((char)payload[i] == 0x2B) {
            k++;
            j = 0;
        } else {
            values[k][j] = (char)payload[i];
            j++;
        }
    }

    mqtt_message message;
    message.message_id = atoi(values[0]);
    message.sensor_id = values[1];
    message.action = atoi(values[2]);
    message.student_id = atoi(values[3]);

    if (LAST_KEY >= message.message_id) {
        return;
    }

    LAST_KEY = message.message_id;

    if (strcmp(message.sensor_id, SENSOR_ID) == 0) {
        // ver accion que realizamos
        switch (message.action) {
            case MQTT_ACTION_AUTH:
                client.publish(MQTT_TOPIC_SENSOR_OUT, "MQTT_ACTION_AUTH");
#ifdef FINGERPRINT_SENSOR_CONN
                getFingerprintID(finger);

                // ejecutar lectura
#endif
                break;
            case MQTT_ACTION_REGISTER:
                client.publish(MQTT_TOPIC_SENSOR_OUT, "MQTT_ACTION_REGISTER");
                // Codigo para registrar huella
                Serial.print("REGISTRAR ALUMNO CON ID: ");
                Serial.println(message.student_id);

#ifdef FINGERPRINT_SENSOR_CONN
                while (!enrollFingerprint(atoi(message.student_id), finger))
                    ;
#endif
                break;
            case MQTT_ACTION_CONFIRM:
                client.publish(MQTT_TOPIC_SENSOR_OUT, "MQTT_ACTION_CONFIRM");
                break;
            case MQTT_ACTION_PING:
                client.publish(MQTT_TOPIC_SENSOR_OUT, "MQTT_ACTION_PING");
                return;
        }
    }
}

