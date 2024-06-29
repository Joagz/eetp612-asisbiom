package eetp612.com.ar.asisbiom.mqtt;

import eetp612.com.ar.asisbiom.asistencias.Asistencia;

public record MqttResponseAsistenciaWrapper(
        Asistencia asistencia,
        MqttResponse response) {
}