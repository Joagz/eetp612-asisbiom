
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
    private MqttService mqttService;

    @GetMapping("/{id}")
    public ResponseEntity<?> getBySensorId(@PathVariable Integer id) {
        if (mqttRepository.findById(id).isPresent())
            return ResponseEntity.ok().body(mqttRepository.findById(id).get());
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/send-message")
    public ResponseEntity<?> sendMessageToMqtt(@RequestBody MqttSensorMessage message) {
        try {
            mqttService.sendMessage(message);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("No se pudo enviar!");
        }
        return ResponseEntity.ok().body(message);
    }

    @PostMapping("")
    public ResponseEntity<?> create(@RequestBody Sensor sensor) {
        Sensor saved = mqttRepository.save(sensor);
        return ResponseEntity.ok().body(saved);
    }

    @GetMapping
    public List<Sensor> findAll() {
        return mqttRepository.findAll();
    }

}
