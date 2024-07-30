package eetp612.com.ar.asisbiom.mqtt;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageHandler;
import org.springframework.messaging.MessagingException;

public class MqttMessageHandler implements MessageHandler {

    @Override
    public void handleMessage(Message<?> message) throws MessagingException {
        try {
            String hexString = message.getPayload().toString();
            byte[] arr = hexStringToByteArray(hexString);
            if (arr.length != 16) {
                throw new MessagingException("Invalid message length");
            }

            MqttMessage newMessage = new MqttMessage();

            byte[] mid = new byte[4];
            byte[] sid = new byte[4];
            byte[] act = new byte[4];
            byte[] stid = new byte[4];

            System.arraycopy(arr, 0, mid, 0, 4);
            System.arraycopy(arr, 4, sid, 0, 4);
            System.arraycopy(arr, 8, act, 0, 4);
            System.arraycopy(arr, 12, stid, 0, 4);

            newMessage.setMessageId(mid);
            newMessage.setSensorId(sid);
            newMessage.setAccion(act);
            newMessage.setIdAlumno(stid);

            // System.out.println();
            // System.out.println("MENSAJE RECIBIDO: ");
            // System.out.println("ID MENSAJE: " + MqttUtils.fromByteArray(newMessage.getMessageId()));
            // System.out.println("ID SENSOR: " + MqttUtils.fromByteArray(newMessage.getSensorId()));
            // System.out.println("ID ACCIÓN: " + MqttUtils.fromByteArray(newMessage.getAccion()));
            // System.out.println("ID ALUMNO: " + MqttUtils.fromByteArray(newMessage.getIdAlumno()));

            MqttUtils.addToCounter();

            MqttUtils.addToMessageStack(newMessage);
        } catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println(MqttUtils.getMessageStack());
    }

    private static byte[] hexStringToByteArray(String s) {
        int len = s.length();
        byte[] data = new byte[len / 2];
        for (int i = 0; i < len; i += 2) {
            data[i / 2] = (byte) ((Character.digit(s.charAt(i), 16) << 4)
                                 + Character.digit(s.charAt(i+1), 16));
        }
        return data;
    }
}
