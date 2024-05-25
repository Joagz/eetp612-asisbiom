/*
 * Autor: Joaquín Gómez 
 * EETP N.612 "Eudocio de los Santos Giménez", Coronda, Santa Fe
 */
package eetp612.com.ar.asisbiom.mqtt;

import java.util.Optional;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageHandler;
import org.springframework.messaging.MessagingException;
import org.springframework.stereotype.Component;

import eetp612.com.ar.asisbiom.alumnos.Alumno;
import eetp612.com.ar.asisbiom.alumnos.AlumnoRepository;

@Component
public class MqttMessageHandler implements MessageHandler {

    @Autowired
    private AlumnoRepository alumnoRepository;

    @Autowired
    private MqttService mqttService;

    // TODO
    public void sendMessage(String message){

    }

    public void handleMessage(Message<?> message) throws MessagingException {
        MqttSensorMessage parsed = mqttService.parse(message);

        System.out.println("Mensaje desde " + parsed.getSensorId());

        Optional<Alumno> temp = alumnoRepository.findById(parsed.getIdAlumno());

        if (!temp.isPresent()) {
            System.err.println("Alumno #" + parsed.getIdAlumno() + " no encontrado");
            return;
        }

        Alumno alumno = temp.get();

        mqttService.asistir(alumno);
    }

}
