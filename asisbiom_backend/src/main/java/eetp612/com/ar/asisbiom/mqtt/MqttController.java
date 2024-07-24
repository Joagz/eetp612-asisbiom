
/*
 * Autor: Joaquín Gómez 
 * EETP N.612 "Eudocio de los Santos Giménez", Coronda, Santa Fe
 */
package eetp612.com.ar.asisbiom.mqtt;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Stack;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


record MqttSensorInput(int sensorId, int alumnoId, SensorAction action) {

}

record MqttSensorOutput(int sensorId, int alumnoId, int action, int messageId) {

}

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

    @GetMapping("/last-message/{id}")
    public ResponseEntity<?> getSensorLastMessageById(@PathVariable("id") int id) {
        Optional<Sensor> found = mqttRepository.findById(id);

        if (!found.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Stack<MqttMessage> messages = MqttUtils.getMessageStack();

        MqttMessage message = messages.pop();

        while (MqttUtils.fromByteArray(message.getSensorId()) != id) {
            message = messages.pop();
        }

        return ResponseEntity.ok().body(new MqttSensorOutput(
            MqttUtils.fromByteArray(message.getSensorId()),
            MqttUtils.fromByteArray(message.getIdAlumno()),
            MqttUtils.fromByteArray(message.getAccion()),
            MqttUtils.fromByteArray(message.getMessageId())));
    }

    @GetMapping("/get-messages/{id}")
    public ResponseEntity<?> getSensorMessageBySensorId(@PathVariable("id") int id) {
        Optional<Sensor> found = mqttRepository.findById(id);

        if (!found.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Stack<MqttMessage> messages = MqttUtils.getMessageStack();

        List<MqttSensorOutput> out = new ArrayList<>();

        messages.stream().filter(message -> MqttUtils.fromByteArray(message.getSensorId()) == id)
                .forEach(message -> out.add(new MqttSensorOutput(
                        MqttUtils.fromByteArray(message.getSensorId()),
                        MqttUtils.fromByteArray(message.getIdAlumno()),
                        MqttUtils.fromByteArray(message.getAccion()),
                        MqttUtils.fromByteArray(message.getMessageId()))));
        return ResponseEntity.ok().body(out);
    }

    @PostMapping("/send-message")
    public ResponseEntity<?> sendMessageToMqtt(@RequestBody MqttSensorInput message) {
        try {

            MqttMessage finalMessage = new MqttMessage();
            finalMessage.setAccion(MqttUtils.integerToByteArray(message.action().ordinal()));
            finalMessage.setSensorId(MqttUtils.integerToByteArray(message.sensorId()));
            finalMessage.setIdAlumno(MqttUtils.integerToByteArray(message.alumnoId()));

            mqttService.sendMessage(finalMessage);
        } catch (Exception e) {
            e.printStackTrace();
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
