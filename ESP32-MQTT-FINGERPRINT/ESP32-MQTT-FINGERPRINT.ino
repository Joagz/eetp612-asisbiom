#include "FingerPrintUtils.h"
#include "MqttUtils.h"
#include "ServerUtils.h"

HardwareSerial sensorSerial(2);
Adafruit_Fingerprint finger = Adafruit_Fingerprint(&sensorSerial);
static WiFiClient espClient;
static PubSubClient client(espClient);

void setup() {
  Serial.begin(115200);
  while (!Serial) {
    delay(100);
  }

  finger.begin(57600);

#ifdef FINGERPRINT_SENSOR_CONN
  if (finger.verifyPassword()) {
    Serial.println("Sensor de huella digital encontrado!");
  } else {
    Serial.println("Sensor no encontrado...");
    while (1) {
      Serial.print(".");
      delay(1000);
    }
  }

  Serial.print(F("Estado: 0x"));
  Serial.println(finger.status_reg, HEX);
  Serial.print(F("ID del sistema: 0x"));
  Serial.println(finger.system_id, HEX);
  Serial.print(F("Capacidad: "));
  Serial.println(finger.capacity);
  Serial.print(F("Nivel de seguridad: "));
  Serial.println(finger.security_level);
  Serial.print(F("Dir. del disp.: "));
  Serial.println(finger.device_addr, HEX);
  Serial.print(F("Tam. de paquete: "));
  Serial.println(finger.packet_len);
  Serial.print(F("Baud: "));
  Serial.println(finger.baud_rate);
#endif

#ifdef USE_DEFAULT_WIFI
  WiFi.mode(WIFI_STA);

  WiFi.begin(DEFAULT_WIFI_SSID, DEFAULT_WIFI_PWD);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Conectando a wifi predeterminado..");
  }
  Serial.println("Connected to the WiFi network");
#endif

#ifndef USE_DEFAULT_WIFI
  WiFiManager wiFiManager;
  wiFiManager.resetSettings();

  bool res;

  res = wiFiManager.autoConnect(WIFI_SSID_DEFAULT, WIFI_PWD_DEFAULT);

  if (!res) {
    Serial.println("Falla al conectar! reiniciando...");
    delay(2000);
    ESP.restart();
  }
#endif

  Serial.println("");
  Serial.println("WiFi conectado");
  Serial.println("IP asignada: ");
  Serial.println(WiFi.localIP());

  initMqttClient();
}

void loop() {
  client.loop();
}

void initMqttClient() {
  client.setServer(mqttServer, mqttPort);
  client.setCallback(callback_for_idinfo);

  while (!client.connected()) {
    if (client.connect("ESP32Client", mqttUser, mqttPassword)) {
      break;
    }
  }

  client.subscribe(MQTT_TOPIC_SENSOR_IN);
}
void callback_for_idinfo(char *topic, byte *payload, unsigned int length) {
  char values[4][16] = { { '\0' }, { '\0' }, { '\0' }, { '\0' } };  //64bytes

  Serial.println("Mensaje nuevo !");
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
  Serial.println("Enviando mensaje !");
  Serial.println(message.message_id);
  Serial.println(message.sensor_id);
  Serial.println(message.action);
  Serial.println(message.student_id);

  LAST_KEY = message.message_id;

  if (strcmp(message.sensor_id, SENSOR_ID) == 0) {
    // ver accion que realizamos
    switch (message.action) {
      case MQTT_ACTION_AUTH:
        Serial.println("MQTT_ACTION_AUTH");
        client.publish(MQTT_TOPIC_SENSOR_OUT, "MQTT_ACTION_AUTH");
#ifdef FINGERPRINT_SENSOR_CONN
        getFingerprintID(finger);

        // ejecutar lectura
#endif
        break;
      case MQTT_ACTION_REGISTER:
        Serial.println("MQTT_ACTION_REGISTER");
        client.publish(MQTT_TOPIC_SENSOR_OUT, "MQTT_ACTION_REGISTER");
        // Codigo para registrar huella
        Serial.print("REGISTRAR ALUMNO CON ID: ");
        Serial.println(message.student_id);

#ifdef FINGERPRINT_SENSOR_CONN
        while (!enrollFingerprint(atoi(message.student_id), finger))
          ;
#endif
        return;
      case MQTT_ACTION_CONFIRM:
        Serial.println("MQTT_ACTION_CONFIRM");
        client.publish(MQTT_TOPIC_SENSOR_OUT, "MQTT_ACTION_CONFIRM");
        break;
      case MQTT_ACTION_PING:
        Serial.println("MQTT_ACTION_PING");
        client.publish(MQTT_TOPIC_SENSOR_OUT, "MQTT_ACTION_PING");
        return;
    }
  }
}