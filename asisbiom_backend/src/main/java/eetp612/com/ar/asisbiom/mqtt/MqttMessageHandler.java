package eetp612.com.ar.asisbiom.mqtt;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageHandler;
import org.springframework.messaging.MessagingException;

public class MqttMessageHandler implements MessageHandler {

    @Override
    public void handleMessage(Message<?> message) throws MessagingException {
        try {
            MqttUtils.addToCounter();
            MqttUtils.addToMessageStack(MqttUtils.parseMessage(message.getPayload().toString()));
        } catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println(MqttUtils.getMessageStack());
    }


}
