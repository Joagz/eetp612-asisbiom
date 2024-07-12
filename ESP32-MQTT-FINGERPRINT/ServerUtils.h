#ifndef SERVERUTILS_H
#define SERVERUTILS_H

#define SERVER_ADDR "http://192.168.1.100:8089"
#define GET_ID_URI "http://192.168.1.100:8089/api/alumno/latestid"

#define SENSOR_ID 0x91, 0x93
static int LAST_KEY = -1;

// Credenciales del A.P. creado por el dispositivo
static const char *WIFI_SSID_DEFAULT = "fingerprint_sensor";
static const char *WIFI_PWD_DEFAULT = "1675230706";

#define DEFAULT_WIFI_SSID "Flia Premet"
#define DEFAULT_WIFI_PWD "eljoaqui"
#define USE_DEFAULT_WIFI 1

#endif
