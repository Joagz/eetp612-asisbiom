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

void callback_for_idinfo(char *topic, byte *payload, unsigned int length) {
  Serial.print("Nuevo Mensaje [");
  Serial.print(topic);
  Serial.print("] ");

  char *values[3];

  for (int i = 0, k = 0; i < length; i++) {
    if (payload[i] == '+') {
      k++;
      continue;
    }
    values[k][i] = payload[i];
  }

  Serial.print("id_sensor: ");
  Serial.println(values[0]);
  Serial.print("accion: ");
  Serial.println(values[1]);
  Serial.print("id_alumno: ");
  Serial.println(values[2]);

  if (strcmp(values[0], SENSOR_ID) == 0)
    // Codigo para registrar huella
    while (!enrollFingerprint(atoi(values[2]), finger))
      ;
}

void connectMqtt() {
  if (client.connect("ESP32Client", mqttUser, mqttPassword)) {
    Serial.println("Conectado a servidor MQTT");
  } else {
    // server.handleClient();
    Serial.println("No se pudo conectar al servidor MQTT");
    Serial.print("IP: ");
    Serial.println(mqttServer);
  }
}
void setup() {
  Serial.begin(115200);
  while (!Serial) {
    delay(100);
  }
  client.setServer(mqttServer, mqttPort);
  client.setCallback(callback_for_idinfo);

  initFingerprint(finger);

  WiFi.mode(WIFI_STA);

  WiFiManager wiFiManager;

  wiFiManager.resetSettings();

  bool res;

  res = wiFiManager.autoConnect(WIFI_SSID_DEFAULT, WIFI_PWD_DEFAULT);

  if (!res) {
    Serial.println("Falla al conectar! reiniciando...");
    delay(2000);
    ESP.restart();
  }

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
}



void loop() {
  while (!client.connected()) {
    Serial.println("Intentando reconectar al servidor MQTT...");
    delay(100);
    connectMqtt();
    client.subscribe(MQTT_TOPIC_SENSOR_IN);
  }
  client.publish(MQTT_TOPIC_SENSOR_OUT, "Hola!");
  delay(1000);
}