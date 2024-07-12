
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

enum SensorAction {
    AUTH, REGISTER, CONFIRM, PING
}

record MqttSensorInput(int sensorId, int alumnoId, SensorAction action) {

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

    @PostMapping("/send-message")
    public ResponseEntity<?> sendMessageToMqtt(@RequestBody MqttSensorInput message) {
        try {

            MqttSensorMessage finalMessage = new MqttSensorMessage();
            finalMessage.setAccion(MqttUtils.integerToByteArray(message.action().ordinal()));
            finalMessage.setSensorId(MqttUtils.integerToByteArray(message.sensorId()));
            finalMessage.setIdAlumno(MqttUtils.integerToByteArray(message.alumnoId()));

            System.out.println("message: "+message);
            System.out.println("finalmessage: "+finalMessage);

            System.out.println("Enviando mensaje...");

            mqttService.sendMessage(finalMessage);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("No se pudo enviar!");
        }
        return ResponseEntity.ok().body(message);
    }

    // @PostMapping("/ping")
    // public ResponseEntity<?> ping(@RequestBody MqttSensorMessage message) {
    // MqttSensorMessage res = null;
    // try {
    // message.setAccion(MqttUtils.integerToByteArray(SensorAction.PING.ordinal()));
    // int id = mqttService.sendMessage(message);
    // while
    // (MqttUtils.fromByteArray(MqttMessageHandler.getMessages().peek().getMessageId())
    // != id)
    // ;
    // if (MqttMessageHandler.getMessages().peek().getAccion()
    // .equals(MqttUtils.integerToByteArray(SensorAction.PING.ordinal()))) {
    // res = MqttMessageHandler.getMessages().pop();
    // }
    // } catch (Exception e) {
    // return ResponseEntity.internalServerError().body("No se pudo enviar!");
    // }
    // return ResponseEntity.ok().body(res);
    // }

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
