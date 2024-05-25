
/*
 * Autor: Joaquín Gómez 
 * EETP N.612 "Eudocio de los Santos Giménez", Coronda, Santa Fe
 */
package eetp612.com.ar.asisbiom.mqtt;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/sensor")
public class MqttController {

    @Autowired
    private MqttRepository mqttRepository;
    
    @Autowired
    private MqttMessageSender mqttMessageSender;

    @GetMapping("/{id}")
    public ResponseEntity<?> getBySensorId(@PathVariable String id) {
        if (!mqttRepository.findBySensorId(id).isEmpty())
            return ResponseEntity.ok().body(mqttRepository.findBySensorId(id).get(0));
        return ResponseEntity.notFound().build();
    }

    // TODO
    @PostMapping("/send-message")
    public String sendMessageToMqtt(@RequestBody String message) {
        mqttMessageSender.sendMessage("sensor_registry", message);
        return "Message sent successfully!";
    }

    @GetMapping
    public List<Sensor> findAll() {
        return mqttRepository.findAll();
    }
    

}
