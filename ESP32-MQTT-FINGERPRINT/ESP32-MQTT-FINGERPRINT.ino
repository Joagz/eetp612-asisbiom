#include "FingerPrintUtils.h"
#include "MqttUtils.h"
#include "ServerUtils.h"

HardwareSerial sensorSerial(2);
Adafruit_Fingerprint finger = Adafruit_Fingerprint(&sensorSerial);
static WiFiClient espClient;
static PubSubClient client(espClient);

void setup()
{
  Serial.begin(115200);
  while (!Serial)
  {
    delay(100);
  }

  finger.begin(57600);

#ifdef FINGERPRINT_SENSOR_CONN
  if (finger.verifyPassword())
  {
    Serial.println("Sensor de huella digital encontrado!");
  }
  else
  {
    Serial.println("Sensor no encontrado...");
    while (1)
    {
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

  while (WiFi.status() != WL_CONNECTED)
  {
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

  if (!res)
  {
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

void loop()
{
  client.loop();
}

void initMqttClient()
{
  client.setServer(mqttServer, mqttPort);
  client.setCallback(callback_for_idinfo);

  while (!client.connected())
  {
    if (client.connect("ESP32Client", mqttUser, mqttPassword))
    {
      break;
    }
  }

  client.subscribe(MQTT_TOPIC_SENSOR_IN);
}

void callback_for_idinfo(char *topic, byte *payload, unsigned int length)
{
  mqtt_message message;

  uint32_t mid = 0, sid = 0, aid = 0, stid = 0;

  mid   = mid   | payload[0]  | payload[1]  | payload[2]  | payload[3];
  sid   = sid   | payload[5]  | payload[6]  | payload[7]  | payload[8];
  aid   = aid   | payload[9]  | payload[10] | payload[10] | payload[11];
  stid  = stid  | payload[12] | payload[13] | payload[14] | payload[15];

  message.message_id  = mid;
  message.sensor_id   = sid;
  message.action      = aid;
  message.student_id  = stid;

  if (LAST_KEY >= message.message_id)
  {
    return;
  }

  Serial.print("Message ID: ");
  Serial.println(message.message_id);
  Serial.print("Sensor ID: ");
  Serial.println(message.sensor_id);
  Serial.print("Action ID: ");
  Serial.println(message.action);
  Serial.print("Student ID: ");
  Serial.println(message.student_id);

  LAST_KEY = message.message_id;

  if (message.sensor_id == SENSOR_ID)
  {
    // ver accion que realizamos
    switch (message.action)
    {
      case MQTT_ACTION_AUTH:
        Serial.println("MQTT_ACTION_AUTH");
        client.publish(MQTT_TOPIC_SENSOR_OUT, "MQTT_ACTION_AUTH");
#ifdef FINGERPRINT_SENSOR_CONN
        int id = getFingerprintID(finger);

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
