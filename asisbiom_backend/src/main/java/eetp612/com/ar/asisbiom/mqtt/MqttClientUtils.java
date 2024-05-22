/*
 * Autor: Joaquín Gómez 
 * EETP N.612 "Eudocio de los Santos Giménez", Coronda, Santa Fe
 */
package eetp612.com.ar.asisbiom.mqtt;

import java.time.Instant;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;

public class MqttClientUtils {

    private static final String messageFormatRegex = "[A-Za-z0-9]+\\+[A-Za-z0-9]+\\+[A-Za-z0-9]+\\+[A-Za-z0-9]+:[A-Za-z0-9]+:[A-Za-z0-9]+\\+[A-Za-z0-9]+:[A-Za-z0-9]+:[A-Za-z0-9]+";

    @Autowired
    private MqttRepository mqttRepository;

    /*
     * En el servidor MQTT los sensores envían datos de tiempo a través de un canal.
     * Los mensajes deberán seguir este formato dentro del mismo:
     * 
     * Ejemplo para asistencia:
     * "id_sensor+asistencia+1+HH:mm:ss+dd:MM:yyyy"
     * 
     * Ejemplo para retiro:
     * "id_sensor+retiro+1+HH:mm:ss+dd:MM:yyyy"
     * 
     * En general:
     * "[id_sensor]+[accion]+[id_alumno]+HH:mm:ss+dd:MM:yyyy"
     * 
     * donde id_sensor es la identificación del sensor dentro del servidor, asignada
     * en su microcontrolador.
     * El segundo campo contiene la hora, seguido de una barra inclinada y la fecha.
     * Los datos son luego transformados en LocalTime y Date. El
     * mensaje deberá terminar obligatoriamente con un carácter nulo ("\0")
     * 
     */
    public MqttSensorMessage parse(Message<?> message) {

        String str = message.getPayload().toString();

        if (!str.matches(messageFormatRegex)) {
            return null;
        }

        StringBuilder sb = new StringBuilder();
        char[] charArr = str.toCharArray();
        List<String> parsed = new ArrayList<>();
        MqttSensorMessage parsedMessage = new MqttSensorMessage();

        for (char c : charArr) {
            if (c == '+') {
                parsed.add(sb.toString());
                sb.delete(0, sb.length());
                break;
            }
            sb.append(c);
        }

        if (mqttRepository.findBySensorId(parsed.get(0)).isEmpty()) {
            return null;
        }

        Instant instant = Instant.parse(parsed.get(4));

        parsedMessage.setSensorId(parsed.get(0));
        parsedMessage.setAction(parsed.get(1));
        parsedMessage.setIdAlumno(Integer.parseInt(parsed.get(2)));
        parsedMessage.setTime(LocalTime.parse(parsed.get(3)));
        parsedMessage.setDate(Date.from(instant));

        return parsedMessage;

    }

}
