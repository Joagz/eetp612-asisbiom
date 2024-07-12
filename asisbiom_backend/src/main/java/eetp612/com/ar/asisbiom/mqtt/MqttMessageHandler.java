package eetp612.com.ar.asisbiom.mqtt;

import java.util.ArrayList;
import java.util.List;
import java.util.Stack;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageHandler;
import org.springframework.messaging.MessagingException;

public class MqttMessageHandler implements MessageHandler {

    // private static final String messageFormatRegex = "[A-Za-z0-9]+\\+[A-Za-z0-9]+\\+[A-Za-z0-9]";
    // private static final Stack<MqttSensorMessage> messages = new Stack<>();

    /*
     * En el servidor MQTT los sensores envían datos de tiempo a través de un canal.
     * Los mensajes deberán seguir este formato dentro del mismo:
     * 
     * "[id_mensaje *secuencial]+[id_sensor]+[accion]+[id_alumno]"
     * 
     * donde id_sensor es la identificación del sensor dentro del servidor, asignada
     * en su microcontrolador.
     * El segundo campo contiene la hora, seguido de una barra inclinada y la fecha.
     * Los datos son luego transformados en LocalTime y Date. El
     * mensaje deberá terminar obligatoriamente con un carácter nulo ("\0")
     * 
     */
    // private MqttSensorMessage parse(String message) {

    //     if (!message.matches(messageFormatRegex)) {
    //         return null;
    //     }

    //     StringBuilder sb = new StringBuilder();
    //     char[] charArr = message.toCharArray();
    //     List<String> parsed = new ArrayList<>();
    //     MqttSensorMessage parsedMessage = new MqttSensorMessage();

    //     parsedMessage.setMessageId(Integer.parseInt(parsed.get(0)));
    //     parsedMessage.setSensorId(Integer.parseInt(parsed.get(1)));
    //     parsedMessage.setAccion(Integer.parseInt(parsed.get(2)));
    //     parsedMessage.setIdAlumno(Integer.parseInt(parsed.get(3)));

    //     return parsedMessage;

    // }


    @Override
    public void handleMessage(Message<?> message) throws MessagingException {
        System.out.println(message.getPayload().toString());
    }

    // public static Stack<MqttSensorMessage> getMessages() {
    //     return messages;
    // }

}

