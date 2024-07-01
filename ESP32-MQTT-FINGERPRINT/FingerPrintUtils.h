#ifndef FINGERPRINTUTILS_H
#define FINGERPRINTUTILS_H
#include <Adafruit_Fingerprint.h>

int getFingerprintID(Adafruit_Fingerprint finger);
int enrollFingerprint(int id, Adafruit_Fingerprint finger);
void initFingerprint(Adafruit_Fingerprint finger);
#endif