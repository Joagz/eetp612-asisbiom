/*
 * Autor: Joaquín Gómez 
 * EETP N.612 "Eudocio de los Santos Giménez", Coronda, Santa Fe
 */
package eetp612.com.ar.asisbiom.mqtt;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.stereotype.Service;

import eetp612.com.ar.asisbiom.alumnos.Alumno;
import eetp612.com.ar.asisbiom.asistencias.Asistencia;
import eetp612.com.ar.asisbiom.asistencias.AsistenciaRepository;
import eetp612.com.ar.asisbiom.conteoasistencias.ConteoAsistencia;
import eetp612.com.ar.asisbiom.conteoasistencias.ConteoRepository;
import eetp612.com.ar.asisbiom.general.DateUtils;
import eetp612.com.ar.asisbiom.horarios.Horario;
import eetp612.com.ar.asisbiom.horarios.HorarioRepository;

@Service
public class MqttService {

    private static final String messageFormatRegex = "[A-Za-z0-9]+\\+[A-Za-z0-9]+\\+[A-Za-z0-9]";

    @Autowired
    private MqttRepository mqttRepository;

    @Autowired
    private AsistenciaRepository asistenciaRepository;

    @Autowired
    private HorarioRepository horarioRepository;

    @Autowired
    private ConteoRepository conteoRepository;

    /*
     * En el servidor MQTT los sensores envían datos de tiempo a través de un canal.
     * Los mensajes deberán seguir este formato dentro del mismo:
     * 
     * Ejemplo para asistencia:
     * "id_sensor+asistencia+1"
     * 
     * Ejemplo para retiro:
     * "id_sensor+retiro+1"
     * 
     * En general:
     * "[id_sensor]+[accion]+[id_alumno]"
     * 
     * donde id_sensor es la identificación del sensor dentro del servidor, asignada
     * en su microcontrolador.
     * El segundo campo contiene la hora, seguido de una barra inclinada y la fecha.
     * Los datos son luego transformados en LocalTime y Date. El
     * mensaje deberá terminar obligatoriamente con un carácter nulo ("\0")
     * 
     */
    public MqttSensorMessage parse(Message<?> message) {

        String str = message.getPayload().toString();

        if (!str.matches(messageFormatRegex)) {
            return null;
        }

        StringBuilder sb = new StringBuilder();
        char[] charArr = str.toCharArray();
        List<String> parsed = new ArrayList<>();
        MqttSensorMessage parsedMessage = new MqttSensorMessage();

        for (char c : charArr) {
            if (c == '+') {
                parsed.add(sb.toString());
                sb.delete(0, sb.length());
                break;
            }
            sb.append(c);
        }

        if (mqttRepository.findBySensorId(parsed.get(0)).isEmpty()) {
            return null;
        }

        parsedMessage.setSensorId(parsed.get(0));
        parsedMessage.setAction(parsed.get(1));
        parsedMessage.setIdAlumno(Integer.parseInt(parsed.get(2)));

        return parsedMessage;

    }

    public MqttResponse retirar(Alumno alumno, Asistencia asistencia) {

        List<ConteoAsistencia> found = conteoRepository.findByAlumno(alumno);

        if (found.isEmpty()) {
            ConteoAsistencia newConteo = new ConteoAsistencia(alumno);
            found.add(conteoRepository.save(newConteo));
        }

        ConteoAsistencia conteo = found.get(0);

        conteo.setRetiros(conteo.getRetiros() + 1);
        conteoRepository.save(conteo);

        asistencia.setRetirado(true);
        asistencia.setHorarioRetiro(LocalTime.now());
        asistenciaRepository.save(asistencia);

        return MqttResponse.OK;
    }

    public MqttResponse asistir(Alumno alumno) {

        List<Asistencia> asistencias = asistenciaRepository.findByAlumnoAndFecha(alumno, LocalDate.now());
        asistencias.stream().filter(asistencia -> asistencia.getHorarioRetiro() == null).collect(Collectors.toList());

        if (!asistencias.isEmpty()) {
            System.out.println("ERROR INESPERADO: El alumno todavía sigue en el turno, intentando retirar...");
            return MqttResponse.RETIRAR;
        }

        Asistencia newAsistencia = new Asistencia();
        // Conseguir listado de horarios por curso, division y día de la semana
        List<Horario> horarios = horarioRepository.findByCursoAndDivisionAndDiaOrderByDiaAsc(alumno.getCurso(),
                alumno.getDivision(), DateUtils.getDay());

        // Filtrar aquellos horarios que sean anteriores a la hora actual
        horarios.stream().filter(horario -> horario.getHorarioSalida().isAfter(LocalTime.now()))
                .collect(Collectors.toList());

        // Si no hay horarios, volver.
        if (horarios.isEmpty()) {
            System.out.println("ERROR: No se asiste al alumno, no hay horarios para " + alumno.getCurso() + " '"
                    + alumno.getDivision() + "' en este turno.");
            return MqttResponse.ERROR_NO_HORARIO;
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

        if (horario.getHorarioEntrada().isBefore(LocalTime.now())) {
            tardanza = true;
        }

        newAsistencia.setAlumno(alumno);
        newAsistencia.setFecha(LocalDate.now());
        newAsistencia.setHorarioEntrada(LocalTime.now());
        newAsistencia.setTardanza(tardanza);
        newAsistencia.setRetirado(false);

        asistenciaRepository.save(newAsistencia);

        return MqttResponse.OK;
    }

}
