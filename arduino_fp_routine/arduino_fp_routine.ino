#include <stdio.h>
#include <stdlib.h>

/* ################ Declaraciones ################ */

uint8_t getFingerprintEnroll(Adafruit_Fingerprint finger, uint8_t id) {

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


// Standard
#define STOPBYTE 0x00
#define MAX_PACKET_SIZE 20

// Códigos de respuesta
#define DOAUTH 0x01  // por defecto
#define DOREGISTER 0x02
#define DOTHROWPACKET 0x03

// para el registro
#define PENDING 0x04
#define COMPLETE 0x05

SoftwareSerial mySerial(2, 3);
Adafruit_Fingerprint finger = Adafruit_Fingerprint(&mySerial);

/* FORMATO DEL PAYLOAD */

/* 
  Los primeros 4 bytes definen la acción,
  los demás son datos extra o ceros 
*/
static const unsigned char HEADERBYTES[2] = { 0xFF, 0xAA };
static const unsigned char FOOTERBYTES[2] = { 0xFF, 0xEE };

const static unsigned char REGYBTES[4] = { 0x52, 0x45, 0x47, 0x49 };
const static unsigned char AUTHBYTES[4] = { 0x41, 0x55, 0x54, 0x48 };
const static unsigned char CONFBYTES[4] = { 0x43, 0x4F, 0x4E, 0x46 };
const static unsigned char ERROBYTES[4] = { 0x45, 0x52, 0x52, 0x4F };

/* FIN DE FORMATO DEL PAYLOAD */

// uart_data_packet es enviado a traves del serial
// hacia el Raspberry
typedef struct {
  unsigned char header[2];
  unsigned char action[4];
  unsigned char payload[12];  // Rellenar con 0's
  unsigned char footer[2];
} uart_data_packet;

// Datos de registro de huella
typedef struct {
  unsigned char fp_id;
  int status;
} register_data;

/* ################ FIN Declaraciones ################ */

void init_data_packet(uart_data_packet *datapacket) {
  datapacket->footer[0] = FOOTERBYTES[0];
  datapacket->footer[1] = FOOTERBYTES[1];

  datapacket->header[0] = HEADERBYTES[0];
  datapacket->header[1] = HEADERBYTES[1];
}

uart_data_packet build_data_packet(unsigned char _action[4]) {
  uart_data_packet packet;
  init_data_packet(&packet);

  unsigned char action[4] = { 0 };

  packet.action[0] = _action[0];
  packet.action[1] = _action[1];
  packet.action[2] = _action[2];
  packet.action[3] = _action[3];

  return packet;
}

char *deserialize(uart_data_packet *packet) {

  unsigned char res[20] = { 0 };

  res[0] = packet->header[0];
  res[1] = packet->header[1];

  res[2] = packet->action[0];
  res[3] = packet->action[1];
  res[4] = packet->action[2];
  res[5] = packet->action[3];

  for (int i = 0; i < 16; i++) {
    res[5 + i] = packet->payload[i];
  }

  res[18] = packet->footer[0];
  res[19] = packet->footer[1];

  return res;
}

int serialize(unsigned char data[MAX_PACKET_SIZE], uart_data_packet *packet) {
  int k = 0;
  for (int j = 0, i = 0, m = 0; j < MAX_PACKET_SIZE; j++) {
    if (j < 2) {
      if (data[j] == (HEADERBYTES[k])) {
        k++;
        continue;
      } else return -1;
    } else if (j < 6) {
      packet->action[m] = data[j];
      m++;
    } else if (j < 18) {
      k = 0;  // continue redefining...
      packet->payload[i] = data[j];
      i++;
    } else {
      if (data[j] == (FOOTERBYTES[k])) {
        k++;
        continue;
      } else return -1;
    }
  }

  return 0;
}

// Funciones Principales

void setup() {
  Serial.begin(9600);
  finger.begin(57600);

  if (finger.verifyPassword()) {
    Serial.println("Sensor de huella encontrado");
  } else {
    Serial.println("Sensor de huella NO encontrado");
    while (1) { delay(1); }
  }

  finger.getParameters();
  Serial.print(F("Estado: 0x"));
  Serial.println(finger.status_reg, HEX);
  Serial.print(F("ID Sistema: 0x"));
  Serial.println(finger.system_id, HEX);
  Serial.print(F("Capacidad: "));
  Serial.println(finger.capacity);
  Serial.print(F("Nivel de seguridad: "));
  Serial.println(finger.security_level);
  Serial.print(F("Dirección del dispositivo: "));
  Serial.println(finger.device_addr, HEX);
  Serial.print(F("Tamaño de paquete: "));
  Serial.println(finger.packet_len);
  Serial.print(F("Tasa de baudios: "));
  Serial.println(finger.baud_rate);
}

int cmpactions(unsigned char a[4], unsigned char b[4]) {
  for (int i = 0; i < 4; i++) {
    if (a[0] != b[0]) return -1;
  }
  return 0;
}

void loop() {
  Serial.begin(9600);
  if (Serial.available() > 0) {
    unsigned char buffer[MAX_PACKET_SIZE] = { '\0' };
    Serial.readBytes(buffer, MAX_PACKET_SIZE);

    uart_data_packet packet;
    init_data_packet(&packet);
    int err = serialize(buffer, &packet);

    if (err == 0) {

      if (cmpactions(packet.action, REGYBTES) == 0) {
        Serial.println("REGISTER");

        uint8_t id = 0;
        for (int i = 0; i < sizeof(packet.payload); i++) {
          if (packet.payload[i] == 0x00) break;
          id += packet.payload[i];
        }

        if (id < 0) {
          Serial.println("ID can't be zero!");
          return;
        };

        register_data data = { .fp_id = id, .status = PENDING };

        int tries = 0;
        Serial.print("Intentando guardar huella con ID: ");
        Serial.println(data.fp_id);

        // while (!getFingerprintEnroll(finger, data.fp_id) && tries < 10)
        //   tries++;

        // if (tries < 10) {
        //   Serial.println("Fingerprint enrollment successful.");
        //   data.status = COMPLETE;
        // } else {
        //   Serial.println("Fingerprint enrollment failed after 10 attempts.");
        // }

        if (data.status == COMPLETE) {
          Serial.println("enviando conf");
          uart_data_packet confpacket = build_data_packet(CONFBYTES);

          Serial.write(deserialize(&confpacket));

        } else {
          Serial.println("enviando error");
        }

      } else if (cmpactions(packet.action, AUTHBYTES) == 0) {
        Serial.println("AUTH");

      } else {
        Serial.println("No matching action type for this packet");
      }

      Serial.println("\nPayload:");
      for (int i = 0; i < 16; i++) {
        Serial.print("0x");
        Serial.print(packet.payload[i], HEX);
        Serial.print("  ");
      }
      Serial.println();
    }
  }
}
