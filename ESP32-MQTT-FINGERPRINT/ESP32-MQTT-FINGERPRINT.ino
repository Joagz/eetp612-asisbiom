#include <WiFi.h>
#include <PubSubClient.h>
#include <Adafruit_Fingerprint.h>
#include <Preferences.h>


// Variables Globales
static int latestId = NULL;  // Se usara para guardar la id en el sensor de huella

// Constantes
static const uint8_t REGMODE_PIN = 0;
static const uint8_t AUTHMODE_PIN = 4;

static const char *MQTT_SYSINFO = "sysinfo";
static const char *MQTT_IDINFO = "idinfo";
static const char *MQTT_GENERAL = "general";

static const char *AUTHMODE = "mode_auth";
static const char *REGMODE = "mode_register";

static const char *ssid = "Proyecto PLC";           // LUEGO CAMBIAR!!!
static const char *password = "58389539";          // LUEGO CAMBIAR!!!

static const char *mqttServer = "192.168.100.50";  // IP DEL SERVIDOR MQTT

static const char *mqttPassword = "12345";
static const char *mqttUser = "ROOT";  

static const int mqttPort = 1880;                  // PUERTO DEL SERVIDOR MQTT

static const char* SENSOR_ID = "ABCD1234";

// EEPROM memory
Preferences pref;
// Wifi
WiFiClient espClient;
// MQTT
PubSubClient client(espClient);
// HSERIAl
HardwareSerial sensorSerial(2);
// FP_SENSOR
Adafruit_Fingerprint finger = Adafruit_Fingerprint(&sensorSerial);

uint8_t getFingerprintEnroll(uint8_t id) {

  int p = -1;
  Serial.print("Waiting for valid finger to enroll as #");
  Serial.println(id);
  while (p != FINGERPRINT_OK) {
    p = finger.getImage();
    switch (p) {
      case FINGERPRINT_OK:
        Serial.println("Image taken");
        break;
      case FINGERPRINT_NOFINGER:
        Serial.print(".");
        return false;
      case FINGERPRINT_PACKETRECIEVEERR:
        Serial.println("Communication error");
        return false;
      case FINGERPRINT_IMAGEFAIL:
        Serial.println("Imaging error");
        return false;
      default:
        Serial.println("Unknown error");
        return false;
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

  Serial.println("Remove finger");
  delay(2000);
  p = 0;
  while (p != FINGERPRINT_NOFINGER) {
    p = finger.getImage();
  }
  Serial.print("ID ");
  Serial.println(id);
  p = -1;
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
      Serial.println("Could not find fingerprint features");
      return p;
    default:
      Serial.println("Unknown error");
      return p;
  }

  // OK converted!
  Serial.print("Creating model for #");
  Serial.println(id);

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
    Serial.println("Unknown error");
    return p;
  }

  Serial.print("ID ");
  Serial.println(id);
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
    Serial.println("Unknown error");
    return p;
  }

  return true;
}

// Registrar una nueva huella aqui
void callback_for_idinfo(char *topic, byte *payload, unsigned int length) {

  char num[length] = { '\0' };
  for (int i = 0; i < length; i++) {
    num[i] = payload[i];
  }


  latestId = atoi(num);
  Serial.println(num);

  // Codigo para registrar huella
  while (!getFingerprintEnroll(latestId))
    ;
  ;
}

int getFingerprintID() {
  uint8_t p = finger.getImage();
  switch (p) {
    case FINGERPRINT_OK:
      Serial.println("Image taken");
      break;
    case FINGERPRINT_NOFINGER:
      Serial.println("No finger detected");
      return -1;
    case FINGERPRINT_PACKETRECIEVEERR:
      Serial.println("Communication error");
      return -1;
    case FINGERPRINT_IMAGEFAIL:
      Serial.println("Imaging error");
      return -1;
    default:
      Serial.println("Unknown error");
      return -1;
  }

  // OK success!

  p = finger.image2Tz();
  switch (p) {
    case FINGERPRINT_OK:
      Serial.println("Image converted");
      break;
    case FINGERPRINT_IMAGEMESS:
      Serial.println("Image too messy");
      return -1;
    case FINGERPRINT_PACKETRECIEVEERR:
      Serial.println("Communication error");
      return -1;
    case FINGERPRINT_FEATUREFAIL:
      Serial.println("Could not find fingerprint features");
      return -1;
    case FINGERPRINT_INVALIDIMAGE:
      Serial.println("Could not find fingerprint features");
      return -1;
    default:
      Serial.println("Unknown error");
      return -1;
  }

  // OK converted!
  p = finger.fingerSearch();
  if (p == FINGERPRINT_OK) {
    Serial.println("Found a print match!");
  } else if (p == FINGERPRINT_PACKETRECIEVEERR) {
    Serial.println("Communication error");
    return -1;
  } else if (p == FINGERPRINT_NOTFOUND) {
    Serial.println("Did not find a match");
    return -1;
  } else {
    Serial.println("Unknown error");
    return -1;
  }

  // found a match!
  Serial.print("Found ID #");
  Serial.print(finger.fingerID);
  Serial.print(" with confidence of ");
  Serial.println(finger.confidence);

  return finger.fingerID;
}
void setup() {

  pinMode(REGMODE_PIN, INPUT_PULLUP);
  pinMode(AUTHMODE_PIN, INPUT_PULLUP);

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

  Serial.println();
  Serial.println("******************************************************");
  Serial.print("Conectando a ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi conectado");
  Serial.println("IP: ");
  Serial.println(WiFi.localIP());

  client.setServer(mqttServer, mqttPort);
  client.setCallback(callback_for_idinfo);

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