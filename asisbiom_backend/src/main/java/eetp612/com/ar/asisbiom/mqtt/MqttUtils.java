package eetp612.com.ar.asisbiom.mqtt;

import java.math.BigInteger;
import java.util.Stack;

import org.springframework.messaging.MessagingException;

import lombok.experimental.UtilityClass;

@UtilityClass
public class MqttUtils {
    private static Integer COUNTER = 0;
    private static Stack<MqttMessage> messageStack = new Stack<>();

    public static Stack<MqttMessage> getMessageStack() {
        return messageStack;
    }

    public static void addToMessageStack(MqttMessage message) {
        messageStack.add(message);
    }

    public static void addToCounter() {
        COUNTER++;
    }

    public static int getCounter() {
        return COUNTER;
    }

    public static byte[] integerToByteArray(int value) {
        return new byte[] {
                (byte) (value >>> 24),
                (byte) (value >>> 16),
                (byte) (value >>> 8),
                (byte) value };
    }

    public static int fromByteArray(byte[] bytes) {
        return new BigInteger(bytes).intValue();
    }

    public static void printHex(byte[] byteArray) {
        String hex = "";

        // Iterating through each byte in the array
        for (byte i : byteArray) {
            hex += String.format("0x%02X ", i);
        }

        System.out.print(hex);
        System.out.println();
    }

    private static byte[] hexStringToByteArray(String s) {
        int len = s.length();
        System.out.println(len);
        byte[] data = new byte[len / 2];
        for (int i = 0; i < len; i += 2) {
            data[i / 2] = (byte) ((Character.digit(s.charAt(i), 16) << 4)
                                 + Character.digit(s.charAt(i+1), 16));
        }
        return data;
    }

    public static MqttMessage parseMessage(String hexString) {
        byte[] arr = hexStringToByteArray(hexString);
        if(arr == null) return null;
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

        return newMessage;
    }

}
