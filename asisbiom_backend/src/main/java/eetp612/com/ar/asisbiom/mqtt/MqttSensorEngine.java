package eetp612.com.ar.asisbiom.mqtt;

import java.util.concurrent.Callable;

import org.eclipse.paho.client.mqttv3.IMqttClient;
import org.eclipse.paho.client.mqttv3.MqttMessage;

public class MqttSensorEngine implements Callable<Void> {

    public static final String TOPIC_IN = "mqtt_sensor_in";
    private final IMqttClient client;

    private String message = null;

    public void setMessage(String message) {
        this.message = message;
    }

    public MqttSensorEngine(IMqttClient client) {
        this.client = client;
    }

    @Override
    public Void call() throws Exception {
        if (!client.isConnected()) {
            System.err.println("Client not connected!");
            return null;
        }
        if (message == null) {
            System.out.println("Message is null");
            return null;
        }
        
        MqttMessage msg = new MqttMessage(message.getBytes());
        msg.setQos(0);
        msg.setRetained(true);
        client.publish(TOPIC_IN, msg);

        return null;
    }

}
