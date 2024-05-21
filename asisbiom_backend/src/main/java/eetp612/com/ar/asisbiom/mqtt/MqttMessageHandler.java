/*
 * Autor: Joaquín Gómez 
 * EETP N.612 "Eudocio de los Santos Giménez", Coronda, Santa Fe
 */
package eetp612.com.ar.asisbiom.mqtt;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.chrono.ChronoLocalDate;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageHandler;
import org.springframework.messaging.MessagingException;
import org.springframework.stereotype.Component;

import eetp612.com.ar.asisbiom.alumnos.Alumno;
import eetp612.com.ar.asisbiom.alumnos.AlumnoRepository;
import eetp612.com.ar.asisbiom.asistencias.Asistencia;
import eetp612.com.ar.asisbiom.asistencias.AsistenciaRepository;
import eetp612.com.ar.asisbiom.general.DateUtils;
import eetp612.com.ar.asisbiom.horarios.Horario;
import eetp612.com.ar.asisbiom.horarios.HorarioRepository;

@Component
public class MqttMessageHandler implements MessageHandler {

    private static final String ACTION_ASISTIR = "asistir";
    private static final String ACTION_RETIRAR = "retirar";

    @Autowired
    private AsistenciaRepository asistenciaRepository;

    @Autowired
    private AlumnoRepository alumnoRepository;

    @Autowired
    private HorarioRepository horarioRepository;

    // TODO: IMPLEMENTAR 
    private void retirar(Alumno alumno) {
    }

    // Asistir a un alumno al colocar su huella
    private void asistir(Alumno alumno) {
        List<Asistencia> asistencias = asistenciaRepository.findByAlumnoAndDiaOrderByIdDesc(alumno, DateUtils.getDay());

        asistencias.stream().filter(asistencia -> asistencia.getHorarioSalida() == null).collect(Collectors.toList());

        if (!asistencias.isEmpty()) {
            System.out.println("ERROR INESPERADO: El alumno todavía sigue en el turno, intentando retirar...");
            retirar(alumno);
            return;
        }

        Asistencia newAsistencia = new Asistencia();
        // Conseguir listado de horarios por curso, division y día de la semana
        List<Horario> horarios = horarioRepository.findByCursoAndDivisionAndDiaOrderByDiaAsc(alumno.getCurso(),
                alumno.getDivision(), DateUtils.getDay());

        // Filtrar aquellos horarios que sean anteriores a la hora actual
        horarios.stream().filter(horario -> horario.getHorarioSalida().isAfter(ChronoLocalDate.from(LocalTime.now())))
                .collect(Collectors.toList());

        // Si no hay horarios, volver.
        if (horarios.isEmpty()) {
            System.out.println("ERROR: No se asiste al alumno, no hay horarios para " + alumno.getCurso() + " '"
                    + alumno.getDivision() + "' en este turno.");
            return;
        }

        // Ordenar los horarios para que el horario de entrada más cercano esté primero.
        horarios.sort(new Comparator<Horario>() {
            @Override
            public int compare(Horario a, Horario b) {
                return a.getHorarioEntrada().compareTo(b.getHorarioEntrada());
            }
        });

        Horario horario = horarios.get(0);
        boolean tardanza = false;

        if (horario.getHorarioEntrada().isBefore(ChronoLocalDate.from(LocalTime.now()))) {
            tardanza = true;
        }

        newAsistencia.setAlumno(alumno);
        newAsistencia.setFecha(Date.from(Instant.now()));
        newAsistencia.setHorarioEntrada(LocalDate.now());
        newAsistencia.setTardanza(tardanza);
        newAsistencia.setRetirado(false);

        asistenciaRepository.save(newAsistencia);
    }

    @Override
    public void handleMessage(Message<?> message) throws MessagingException {
        MqttClientUtils clientUtils = new MqttClientUtils();
        MqttSensorMessage parsed = clientUtils.parse(message);

        System.out.println("Mensaje desde " + parsed.getSensorId());

        Optional<Alumno> temp = alumnoRepository.findById(parsed.getIdAlumno());

        if (!temp.isPresent()) {
            System.err.println("Alumno #" + parsed.getIdAlumno() + " no encontrado");
            return;
        }

        Alumno alumno = temp.get();

        switch (parsed.getAction()) {
            case ACTION_ASISTIR:
                asistir(alumno);
                break;

            case ACTION_RETIRAR:
                retirar(alumno);
                break;

            default:
                return;
        }

    }

}
