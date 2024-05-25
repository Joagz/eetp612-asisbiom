
/*
 * Autor: Joaquín Gómez 
 * EETP N.612 "Eudocio de los Santos Giménez", Coronda, Santa Fe
 */
package eetp612.com.ar.asisbiom.mqtt;

import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.integration.dsl.IntegrationFlow;
import org.springframework.integration.mqtt.core.DefaultMqttPahoClientFactory;
import org.springframework.integration.mqtt.core.MqttPahoClientFactory;
import org.springframework.integration.mqtt.inbound.MqttPahoMessageDrivenChannelAdapter;
import org.springframework.integration.mqtt.support.DefaultPahoMessageConverter;
import org.springframework.messaging.converter.MessageConverter;

@Configuration
public class MqttClientConfiguration {

    @Bean
    public MessageConverter mqttMessageConverter() {
        return new DefaultPahoMessageConverter();
    }

    @Bean
    public MqttPahoClientFactory mqttClientFactory() {
        DefaultMqttPahoClientFactory factory = new DefaultMqttPahoClientFactory();
        MqttConnectOptions options = new MqttConnectOptions();
        options.setServerURIs(new String[] { "tcp://localhost:1888" });
        options.setUserName("asisbiom-backend");
        options.setPassword("test-pwd".toCharArray());
        factory.setConnectionOptions(options);
        return factory;
    }

    @Bean
    public IntegrationFlow mqqtInbound(MqttPahoClientFactory mqttPahoClientFactory,
            MqttMessageHandler messageHandler) {

        return IntegrationFlow
                .from(new MqttPahoMessageDrivenChannelAdapter("asisbiom-backend-mqttclient", mqttPahoClientFactory,
                        "sensor_registry"))
                .handle(messageHandler)
                .get();
    }

}
