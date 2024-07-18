package eetp612.com.ar.asisbiom.mqtt;

import java.math.BigInteger;
import java.util.Stack;

import lombok.experimental.UtilityClass;

@UtilityClass
public class MqttUtils {
    private static Integer COUNTER = 0;
    private static Stack<MqttMessage> messageStack = new Stack<>();

    static Stack<MqttMessage> getMessageStack() {
        return messageStack;
    }

    static void addToMessageStack(MqttMessage message) {
        messageStack.add(message);
    }

    static void addToCounter() {
        COUNTER++;
    }

    static int getCounter() {
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

}
