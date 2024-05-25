package eetp612.com.ar.asisbiom.mqtt;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.integration.mqtt.core.MqttPahoClientFactory;
import org.springframework.integration.mqtt.outbound.MqttPahoMessageHandler;
import org.springframework.integration.support.MessageBuilder;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessagingException;
import org.springframework.stereotype.Service;

@Service
public class MqttMessageSender {

    @Autowired
    private MqttPahoClientFactory mqttClientFactory;

    public void sendMessage(String topic, String payload) {
        MqttPahoMessageHandler messageHandler = new MqttPahoMessageHandler("client_id", mqttClientFactory);
        messageHandler.setAsync(true); // Set to true for asynchronous message publishing
        messageHandler.setDefaultTopic(topic);

        Message<String> message = MessageBuilder.withPayload(payload).build();

        try {
            messageHandler.handleMessage(message);
        } catch (MessagingException e) {
            e.printStackTrace();
            // Handle exception
        }
    }
}
