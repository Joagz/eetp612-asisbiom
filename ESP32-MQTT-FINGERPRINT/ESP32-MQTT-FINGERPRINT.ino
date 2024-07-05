#include "FingerPrintUtils.h"
#include "MqttUtils.h"
#include "ServerUtils.h"

HardwareSerial sensorSerial(2);
Adafruit_Fingerprint finger = Adafruit_Fingerprint(&sensorSerial);

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

    init_mqtt_service();
}

void loop() {
    mqttClientLoop();
}
