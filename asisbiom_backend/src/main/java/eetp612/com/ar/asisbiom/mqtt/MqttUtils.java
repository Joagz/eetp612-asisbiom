package eetp612.com.ar.asisbiom.mqtt;

import lombok.experimental.UtilityClass;

@UtilityClass
public class MqttUtils {

    public static byte[] integerToByteArray(int value) {
        return new byte[] {
                (byte) (value >>> 24),
                (byte) (value >>> 16),
                (byte) (value >>> 8),
                (byte) value };
    }

    public static int fromByteArray(byte[] bytes) {
        return bytes[0] << 24 | (bytes[1] & 0xFF) << 16 | (bytes[2] & 0xFF) << 8 | (bytes[3] & 0xFF);
    }

    public static void printHex(byte[] byteArray)
    {
        String hex = "";
 
        // Iterating through each byte in the array
        for (byte i : byteArray) {
            hex += String.format("%02X", i);
        }
 
        System.out.print(hex);
        System.out.println();
    }


}
