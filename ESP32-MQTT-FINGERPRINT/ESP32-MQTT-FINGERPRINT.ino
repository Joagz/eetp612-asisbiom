#include "FingerPrintUtils.h"
#include "MqttUtils.h"
#include "ServerUtils.h"

#include <HardwareSerial.h>

#define sensorSerial Serial2

Adafruit_Fingerprint finger = Adafruit_Fingerprint(&sensorSerial);
extern void send_mqtt_message_out(mqtt_message message);
static WiFiClient espClient;
static PubSubClient client(espClient);

void sendMsg(int code, int student_id)
{
  mqtt_message message;
  message.action = code;
  message.sensor_id = SENSOR_ID;
  message.message_id = 0;
  message.student_id = student_id;
  send_mqtt_message_out(message);
}

void sendErrMsg(int code, int student_id)
{
  mqtt_message message;
  message.action = code + 0xF0;
  message.sensor_id = SENSOR_ID;
  message.message_id = 0;
  message.student_id = student_id;
  send_mqtt_message_out(message);
}

uint8_t getFingerprintEnroll(int id) {

  int p = -1;
  Serial.print("Waiting for valid finger to enroll as #"); Serial.println(id);
  sendMsg(MQTT_ACTION_REGISTER, id);
  while (p != FINGERPRINT_OK) {
    p = finger.getImage();
    switch (p) {
    case FINGERPRINT_OK:
      Serial.println("Image taken");
      break;
    case FINGERPRINT_NOFINGER:
      Serial.print(".");
      break;
    case FINGERPRINT_PACKETRECIEVEERR:
      Serial.println("Communication error");
      break;
    case FINGERPRINT_IMAGEFAIL:
      Serial.println("Imaging error");
      break;
    default:
      Serial.println("Unknown error");
      break;
    }
  }

  // OK success!

  p = finger.image2Tz(1);
  switch (p) {
    case FINGERPRINT_OK:
      Serial.println("Image converted");
      break;
    case FINGERPRINT_IMAGEMESS:
      Serial.println("Image too messy");
      return p;
    case FINGERPRINT_PACKETRECIEVEERR:
      Serial.println("Communication error");
      return p;
    case FINGERPRINT_FEATUREFAIL:
      Serial.println("Could not find fingerprint features");
      return p;
    case FINGERPRINT_INVALIDIMAGE:
      Serial.println("Could not find fingerprint features");
      return p;
    default:
      Serial.println("Unknown error");
      return p;
  }
  sendMsg(MQTT_ACTION_REMOVE_FINGER, id);

  Serial.println("Remove finger");
  delay(2000);
  p = 0;
  while (p != FINGERPRINT_NOFINGER) {
    p = finger.getImage();
  }
  Serial.print("ID "); Serial.println(id);
  p = -1;
  sendMsg(MQTT_ACTION_PUT_FINGER, id);
  Serial.println("Place same finger again");
  while (p != FINGERPRINT_OK) {
    p = finger.getImage();
    switch (p) {
    case FINGERPRINT_OK:
      Serial.println("Image taken");
      break;
    case FINGERPRINT_NOFINGER:
      Serial.print(".");
      break;
    case FINGERPRINT_PACKETRECIEVEERR:
      Serial.println("Communication error");
      break;
    case FINGERPRINT_IMAGEFAIL:
      Serial.println("Imaging error");
      break;
    default:
      Serial.println("Unknown error");
      break;
    }
  }

  // OK success!

  p = finger.image2Tz(2);
  switch (p) {
    case FINGERPRINT_OK:
      Serial.println("Image converted");
      break;
    case FINGERPRINT_IMAGEMESS:
      Serial.println("Image too messy");
      return p;
    case FINGERPRINT_PACKETRECIEVEERR:
      Serial.println("Communication error");
      return p;
    case FINGERPRINT_FEATUREFAIL:
      Serial.println("Could not find fingerprint features");
      return p;
    case FINGERPRINT_INVALIDIMAGE:
      sendMsg(MQTT_ERROR_REGISTER_FAILED, id);
      return p;
    default:
      sendMsg(MQTT_ERROR_REGISTER_FAILED, id);
      return p;
  }

  // OK converted!
  Serial.print("Creating model for #");  Serial.println(id);

  p = finger.createModel();
  if (p == FINGERPRINT_OK) {
    Serial.println("Prints matched!");
  } else if (p == FINGERPRINT_PACKETRECIEVEERR) {
    Serial.println("Communication error");
    return p;
  } else if (p == FINGERPRINT_ENROLLMISMATCH) {
    Serial.println("Fingerprints did not match");
    return p;
  } else {
    sendMsg(MQTT_ERROR_REGISTER_FAILED, id);
    Serial.println("Unknown error");
    return p;
  }

  Serial.print("ID "); Serial.println(id);
  p = finger.storeModel(id);
  if (p == FINGERPRINT_OK) {
    Serial.println("Stored!");
  } else if (p == FINGERPRINT_PACKETRECIEVEERR) {
    Serial.println("Communication error");
    return p;
  } else if (p == FINGERPRINT_BADLOCATION) {
    Serial.println("Could not store in that location");
    return p;
  } else if (p == FINGERPRINT_FLASHERR) {
    Serial.println("Error writing to flash");
    return p;
  } else {
    sendMsg(MQTT_ERROR_REGISTER_FAILED, id);
    return p;
  }
  sendMsg(MQTT_ACTION_REGISTER_COMPLETE, id);

  return true;
}

int getFingerprintID(Adafruit_Fingerprint finger) {
  uint8_t p = finger.getImage();

  if (p != FINGERPRINT_OK) {
    return -1;
  }

  // OK success!

  p = finger.image2Tz();

  if (p != FINGERPRINT_OK) {
    return -1;
  }

  // OK converted!
  p = finger.fingerSearch();

  if (p != FINGERPRINT_OK) {
    return -1;
  }

  return finger.fingerID;
}

void initFingerprint(Adafruit_Fingerprint finger) {
  finger.begin(57600);

  if (finger.verifyPassword()) {
    Serial.println("Sensor de huella digital encontrado!");
  } else {
    Serial.println("Sensor no encontrado...");
    // ESP.restart();
  }
}

void send_mqtt_message_out(mqtt_message message)
{

  unsigned char str_message[16] = {'\0'};

  str_message[0] = (message.message_id >> 24) & 0xff;
  str_message[1] = (message.message_id >> 16) & 0xff;
  str_message[2] = (message.message_id >> 8) & 0xff;
  str_message[3] = message.message_id & 0xff;

  str_message[4] = (message.sensor_id >> 24) & 0xff;
  str_message[5] = (message.sensor_id >> 16) & 0xff;
  str_message[6] = (message.sensor_id >> 8) & 0xff;
  str_message[7] = message.sensor_id & 0xff;

  str_message[8] = (message.action >> 24) & 0xff;
  str_message[9] = (message.action >> 16) & 0xff;
  str_message[10] = (message.action >> 8) & 0xff;
  str_message[11] = message.action & 0xff;

  str_message[12] = (message.student_id >> 24) & 0xff;
  str_message[13] = (message.student_id >> 16) & 0xff;
  str_message[14] = (message.student_id >> 8) & 0xff;
  str_message[15] = message.student_id & 0xff;

  char hex_message[33];
  for (int i = 0; i < 16; i++)
  {
    sprintf(&hex_message[i * 2], "%02X", str_message[i]);
  }
  hex_message[32] = '\0';

  client.publish(MQTT_TOPIC_SENSOR_OUT, hex_message);
}

send_mqtt_image_capture(uint32_t id_alumno)
{
	char id_alumno_str[4];
	id_alumno_str[0] = (id_alumno >> 24) & 0xff;
	id_alumno_str[1] = (id_alumno >> 16) & 0xff;
	id_alumno_str[2] = (id_alumno >> 8)  & 0xff;
	id_alumno_str[3] = (id_alumno)	     & 0xff;

	client.publish(MQTT_TOPIC_IMAGE_CAPTURE, id_alumno_str);
}


void initMqttClient()
{
    Serial.println("Inicializando cliente MQTT");
    client.setServer(mqttServer, mqttPort);
    client.setCallback(callback_for_idinfo);

    // Define last will message parameters
    const char* willTopic = "lastWillTopic";
    const char* willMessage = "Client disconnected unexpectedly";
    int willQoS = 0;
    bool willRetain = false;

    while (!client.connected())
    {
        Serial.print("Conectando a MQTT...");
        if (client.connect("ESP32Client", mqttUser, mqttPassword, willTopic, willQoS, willRetain, willMessage, true))
        {
            Serial.println("Conectado.");
            client.subscribe(MQTT_TOPIC_SENSOR_IN, 0);
        }
        else
        {
            Serial.print("Error de conexión, rc=");
            Serial.print(client.state());
            Serial.println(" Intentando de nuevo en 5 segundos.");
            delay(5000); 
        }
    }
}


void callback_for_idinfo(char *topic, byte *payload, unsigned int length)
{
  mqtt_message message;
  int id = -1;

  uint32_t mid = 0, sid = 0, aid = 0, stid = 0;

  mid   = mid | payload[0]  | payload[1]  | payload[2]  | payload[3];
  sid   = sid | payload[5]  | payload[6]  | payload[7]  | payload[8];
  aid   = aid | payload[9]  | payload[10] | payload[10] | payload[11];
  stid  = stid | payload[12] | payload[13] | payload[14] | payload[15];

  message.message_id = mid;
  message.sensor_id = sid;
  message.action = aid;
  message.student_id = stid;

  Serial.println("accion : ");
  Serial.println(message.action);
    
 // prevenimos que el sensor se bloquee
  if (LAST_KEY == message.student_id && MQTT_ACTION_REGISTER == message.action)
    return;

  LAST_KEY = message.student_id;
  
  if (message.sensor_id == SENSOR_ID)
  {
    mqtt_message msg_out;
    // ver accion que realizamos
    switch (message.action)
    {
      case MQTT_ACTION_REGISTER:
      
#ifdef FINGERPRINT_SENSOR_CONN
        while (!getFingerprintEnroll(message.student_id))
        {
        }
#endif
        break;
      case MQTT_ACTION_CONFIRM:
        Serial.println("CONFIRMANDO RETIRO");
      
        sendMsg(MQTT_ACTION_CONFIRM, message.student_id);
        
        while((id=getFingerprintID(finger))<0)
        {
          Serial.println("coloque su dedo");
        }
        
        Serial.println(id);
        sendMsg(MQTT_ACTION_CONFIRMATION_COMPLETE, id);
        
        break;
      case MQTT_ACTION_PING:
        sendMsg(MQTT_ACTION_PING, 0);
        break;
    }
  }
}

int retries = 0;

void setup()
{
  Serial.begin(115200);
  while (!Serial)
  {
    delay(100);
  }

#ifdef FINGERPRINT_SENSOR_CONN
  sensorSerial.begin(57600, SERIAL_8N1, 16, 17);
  finger.begin(57600);

  if (finger.verifyPassword())
  {
    Serial.println("Sensor de huella digital encontrado!");

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
  }
  else
  {
    Serial.println("Sensor no encontrado... ");
  }

#endif

#ifdef USE_DEFAULT_WIFI
  WiFi.mode(WIFI_STA);

  WiFi.begin(DEFAULT_WIFI_SSID, DEFAULT_WIFI_PWD);

  while (WiFi.status() != WL_CONNECTED && retries < 10)
  {
    delay(500);
    Serial.println("Conectando a wifi predeterminado..");
    retries++;
  }
  // si se excede el tiempo de espera simplemente conectamos con WIFIMANAGER
  if (retries >= 10)
  {
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
  }
  else
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
  if(client.state() != MQTT_CONNECTED)
    initMqttClient();
    
  client.loop();
 
  // AUTH LOOP
#ifdef FINGERPRINT_SENSOR_CONN
  int id = getFingerprintID(finger);

  if (id > 0) { 
    Serial.println(id);
    mqtt_message message;
    message.message_id = 0;
    message.action = MQTT_ACTION_AUTH;
    message.student_id = id;
    message.sensor_id = SENSOR_ID;
    send_mqtt_message_out(message);
    send_mqtt_image_capture(id);
  }
#endif
}
