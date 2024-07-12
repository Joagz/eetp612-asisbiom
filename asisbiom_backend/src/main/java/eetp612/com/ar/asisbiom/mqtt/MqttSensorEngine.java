package eetp612.com.ar.asisbiom.mqtt;

import java.util.concurrent.Callable;

import org.eclipse.paho.client.mqttv3.IMqttClient;
import org.eclipse.paho.client.mqttv3.MqttMessage;

// Esta clase sirve para publicar mensajes al canal
// que está especificado en TOPIC_IN del servidor MQTT
public class MqttSensorEngine implements Callable<Void> {

    public static final String TOPIC_IN = "mqtt_sensor_in";
    private final IMqttClient client;

    private byte[] message = new byte[16];

    public void setMessage(byte[] message) {
        this.message = message;
    }

    public MqttSensorEngine(IMqttClient client) {
        this.client = client;
    }

    @Override
    public Void call() throws Exception {
        if (!client.isConnected()) {
            System.err.println("Cliente no conectado");
            return null;
        }
        if (message == null) {
            System.out.println("El mensaje está vacío");
            return null;
        }
        MqttUtils.printHex(message);
        MqttMessage msg = new MqttMessage(message);
        msg.setQos(0);
        msg.setRetained(true);
        client.publish(TOPIC_IN, msg);

        return null;
    }

}
