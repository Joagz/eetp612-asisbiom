#include "FingerPrintUtils.h"
#include "MqttUtils.h"
#include "ServerUtils.h"

#include <WiFi.h>
#include <PubSubClient.h>
#include <Preferences.h>
#include <WiFiManager.h>
#include <HTTPClient.h>

#define SENSOR_ID "ABC123"

// Credenciales del A.P. creado por el ESP32

static const char *WIFI_SSID_DEFAULT = "fingerprint_sensor";
static const char *WIFI_PWD_DEFAULT = "1675230706";

// EEPROM memory
Preferences pref;
// Wifi
WiFiClient espClient;
// MQTT
PubSubClient client(espClient);
// HSERIAl
HardwareSerial sensorSerial(2);

Adafruit_Fingerprint finger = Adafruit_Fingerprint(&sensorSerial);

HTTPClient http;

void callback_debug(char *topic, byte *payload, unsigned int length) {
  Serial.print("Nuevo Mensaje [");
  Serial.print(topic);
  Serial.print("]: ");

  // Print the payload as hexadecimal values
  for (int i = 0; i < length; i++) {
    Serial.print("0x");
    if (payload[i] < 0x10) {
      Serial.print("0");
    }
    Serial.print(payload[i], HEX);
    Serial.print(" ");
  }
  Serial.println();
}

void callback_for_idinfo(char *topic, byte *payload, unsigned int length) {
  Serial.print("Nuevo Mensaje [");
  Serial.print(topic);
  Serial.print("] ");

  char values[3][8] = { { '\0' }, { '\0' }, { '\0' } };

  for (int i = 0, k = 0, j = 0; i < length; i++) {
    if ((char)payload[i] == 0x2B) {
      k++;
      j = 0;
    } else {
      values[k][j] = (char)payload[i];
      j++;
    }
  }

  Serial.print("id_sensor: ");
  Serial.println(values[0]);
  Serial.print("accion: ");
  Serial.println(values[1]);
  Serial.print("id_alumno: ");
  Serial.println(values[2]);

  // ver accion que realizamos
  switch (values[1]) {
    case MQTT_ACTION_AUTH:
      break;
    case MQTT_ACTION_REGISTER:
      break;
    case MQTT_ACTION_CONFIRM:
      break;
    case MQTT_ACTION_PING:
      client.publish(MQTT_TOPIC_SENSOR_OUT, "PONG");
      return;
  }


  if (strcmp(values[0], SENSOR_ID) == 0)
    // Codigo para registrar huella
    Serial.print("REGISTRAR ALUMNO CON ID: ");
  Serial.println(values[2]);
  // while (!enrollFingerprint(atoi(values[2]), finger))
  //   ;
}

void setup() {
  Serial.begin(115200);
  while (!Serial) {
    delay(100);
  }

  finger.begin(57600);

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

  WiFi.mode(WIFI_STA);

  WiFi.begin("Flia Premet", "eljoaqui");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Connecting to WiFi..");
  }
  Serial.println("Connected to the WiFi network");

  // WiFiManager wiFiManager;

  // wiFiManager.resetSettings();

  // bool res;

  // res = wiFiManager.autoConnect(WIFI_SSID_DEFAULT, WIFI_PWD_DEFAULT);

  // if (!res) {
  //   Serial.println("Falla al conectar! reiniciando...");
  //   delay(2000);
  //   ESP.restart();
  // }

  Serial.println("");
  Serial.println("WiFi conectado");
  Serial.println("IP asignada: ");
  Serial.println(WiFi.localIP());

  // Testeando el cliente http
  http.begin(SERVER_ADDR);
  int httpResponseCode = http.GET();

  if (httpResponseCode > 0) {
    Serial.println("Conectado al backend correctamente");
  } else {
    Serial.print("Error: ");
    Serial.println(httpResponseCode);
  }
  http.end();

  client.setServer(mqttServer, mqttPort);
  client.setCallback(callback_for_idinfo);
  // client.setCallback(callback_debug);

  while (!client.connected()) {
    Serial.println("Connecting to MQTT...");

    if (client.connect("ESP32Client", mqttUser, mqttPassword)) {

      Serial.println("connected");

    } else {

      Serial.print("failed with state ");
      Serial.print(client.state());
      delay(2000);
    }
  }

  client.subscribe(MQTT_TOPIC_SENSOR_IN);
}

void loop() {
  client.loop();
}
