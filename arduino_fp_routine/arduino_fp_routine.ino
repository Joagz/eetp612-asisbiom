#include <stdio.h>
#include <stdlib.h>

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

/* ################ Declaraciones ################ */

/* FORMATO DEL PAYLOAD */

/* 
  Los primeros 4 bytes definen la acción,
  los demás son datos extra o ceros 
*/
static const unsigned char HEADERBYTES[2] = { 0xFF, 0xAA };
static const unsigned char FOOTERBYTES[2] = { 0xFF, 0xEE };

const static char REGYBTES[16] = {
  0x51, 0x45, 0x47, 0x49,
  0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00
};

const static char AUTHBYTES[16] = {
  'A', 'U', 'T', 'H',
  0x00, 0x00, 0x00, 0x00,  // Acá va la ID del alumno, se lee hasta encontrar STOPBYTE (0)
  0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00
};

/* FIN DE FORMATO DEL PAYLOAD */

// uart_data_packet es enviado a traves del serial
// hacia el Raspberry
typedef struct {
  unsigned char header[2];
  char payload[16];  // Rellenar con 0's
  char footer[2];
} uart_data_packet;

typedef struct {
  unsigned char fp_id;
  unsigned char status = PENDING;
} register_data;

// Inicializar un paquete con datos para el raspberry
void init_data_packet(char payload[16], uart_data_packet *datapacket) {

  for (int i = 0; i < 16; i++) {
    datapacket->payload[i] = payload[i];
  }

  datapacket->footer[0] = FOOTERBYTES[0];
  datapacket->footer[1] = FOOTERBYTES[1];

  datapacket->header[0] = HEADERBYTES[0];
  datapacket->header[1] = HEADERBYTES[1];
}

uart_data_packet *init_data_packet(uart_data_packet *datapacket) {
  datapacket->footer[0] = FOOTERBYTES[0];
  datapacket->footer[1] = FOOTERBYTES[1];

  datapacket->header[0] = HEADERBYTES[0];
  datapacket->header[1] = HEADERBYTES[1];
}


int deserialize(unsigned char data[MAX_PACKET_SIZE], uart_data_packet *packet) {
  int k = 0;
  for (int j = 0, i = 0; j < MAX_PACKET_SIZE; j++) {
    if (j < 2) {
      if (data[j] == (HEADERBYTES[k])) {
        k++;
        continue;
      } else return -1;
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

void register_routine(register_data *data) {
  while (data->status == PENDING) {
    // try to register fingerprint with data->fp_id

    Serial.println(data->fp_id);
    data->status = COMPLETE;
  }
}

// Inicio del programa


// probando ...
void setup() {
  Serial.begin(9600);

  unsigned char data[20] = {
    0xFF,
    0xAA,
    0x51, 0x45, 0x47, 0x49, // REGI
    1,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0xFF,
    0xEE
  };

  uart_data_packet packet = { .header = { 0 }, .payload = { 0 }, .footer = { 0 } };
  init_data_packet(&packet);
  int err = deserialize(data, &packet);

  if (err == -1) Serial.println("PACKET IS NULL");
  Serial.println("\nPayload:");
  for (int i = 0; i < 16; i++) {
    Serial.print("0x");
    Serial.print(packet.payload[i], HEX);
    Serial.print("  ");
  }
}

void loop() {
}
