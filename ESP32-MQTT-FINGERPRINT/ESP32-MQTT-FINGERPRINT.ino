#include "FingerPrintUtils.h"
#include "MqttUtils.h"
#include "ServerUtils.h"

#include <WiFi.h>
#include <PubSubClient.h>
#include <Preferences.h>
#include <WiFiManager.h>
#include <HTTPClient.h>

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

void callback_for_idinfo(char *topic, unsigned char *payload, unsigned int length) {

  

  int latestId;
  http.begin(GET_ID_URI);
  int httpResponseCode = http.GET();

  if (httpResponseCode > 0) {
    String payload = http.getString();
    latestId = atoi(payload);
    Serial.print(payload);
    Serial.println(" será la id del nuevo alumno.");
  } else {
    http.end();
    Serial.println("Error consiguiendo la id del ultimo alumno");
    return;
  }
  http.end();

  // Codigo para registrar huella
  while (!enrollFingerprint(latestId, finger))
    ;
}

void setup() {
  Serial.begin(115200);
  while (!Serial) {
    delay(100);
  }

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

  client.setServer(mqttServer, mqttPort);
  client.setCallback(callback_for_idinfo);


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

  while (!client.connected()) {
    Serial.println("Conectando a MQTT...");
    if (client.connect("ESP32Client", mqttUser, mqttPassword)) {
      Serial.println("Conectado a servidor MQTT");
      client.subscribe("idinfo");
    } else {
      Serial.println("Falla al conectar a MQTT");
      delay(5000);
    }
  }
}



void loop() {

  while (!client.connected()) {
    if (client.connect("ESP32Client", mqttUser, mqttPassword)) {
      Serial.println("Conectado a servidor MQTT");
      client.subscribe("idinfo");
    } else {
      // server.handleClient();
      Serial.println("No se pudo conectar al servidor MQTT");
      Serial.print("IP: ");
      Serial.println(mqttServer);
    }
  }
}