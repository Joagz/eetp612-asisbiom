/*
 * Autor: Joaquín Gómez 
 * EETP N.612 "Eudocio de los Santos Giménez", Coronda, Santa Fe
 */
package eetp612.com.ar.asisbiom.mqtt;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.eclipse.paho.client.mqttv3.IMqttClient;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired
    private AsistenciaRepository asistenciaRepository;

    @Autowired
    private HorarioRepository horarioRepository;

    @Autowired
    private ConteoRepository conteoRepository;

    private MqttSensorEngine engine;

    public MqttService() throws MqttException {
        IMqttClient publisher = new MqttClient("tcp://localhost:1887", "java-application");
        MqttConnectOptions options = new MqttConnectOptions();
        options.setAutomaticReconnect(true);
        options.setCleanSession(true);
        options.setConnectionTimeout(10);
        publisher.connect(options);

        engine = new MqttSensorEngine(publisher);
    }

    public int sendMessage(MqttMessage message) throws Exception {
        byte MESSAGE[] = new byte[16];

        byte[] msg_id = MqttUtils.integerToByteArray(MqttUtils.getCounter());

        MESSAGE[0] = msg_id[0];
        MESSAGE[1] = msg_id[1];
        MESSAGE[2] = msg_id[2];
        MESSAGE[3] = msg_id[3];

        MESSAGE[4] = message.getSensorId()[0];
        MESSAGE[5] = message.getSensorId()[1];
        MESSAGE[6] = message.getSensorId()[2];
        MESSAGE[7] = message.getSensorId()[3];

        MESSAGE[8] = message.getAccion()[0];
        MESSAGE[9] = message.getAccion()[1];
        MESSAGE[10] = message.getAccion()[2];
        MESSAGE[11] = message.getAccion()[3];

        MESSAGE[12] = message.getIdAlumno()[0];
        MESSAGE[13] = message.getIdAlumno()[1];
        MESSAGE[14] = message.getIdAlumno()[2];
        MESSAGE[15] = message.getIdAlumno()[3];

        engine.setMessage(MESSAGE);
        engine.call();
        MqttUtils.addToCounter();
        return MqttUtils.getCounter();
    }

    public MqttResponse retirar(Alumno alumno, Asistencia asistencia) {

        List<ConteoAsistencia> found = conteoRepository.findByAlumno(alumno);

        if (found.isEmpty()) {
            return null;
        }

        ConteoAsistencia conteo = found.get(0);

        conteo.setRetiros(conteo.getRetiros() + 1);
        conteoRepository.save(conteo);

        asistencia.setRetirado(true);
        asistencia.setHorarioRetiro(LocalTime.now());
        asistenciaRepository.save(asistencia);

        return MqttResponse.OK;
    }

    public MqttResponseAsistenciaWrapper asistir(Alumno alumno) {
        // Encontrar asistencias por fecha y alumno
        List<Asistencia> asistencias = asistenciaRepository.findByAlumnoAndFecha(alumno, LocalDate.now());

        // Conseguir listado de horarios por curso, division y día de la semana
        List<Horario> horarios = horarioRepository.findByCursoAndDiaOrderByDiaAsc(alumno.getCurso(),
                DateUtils.getDay());
        Asistencia newAsistencia = new Asistencia();
        newAsistencia.setEnabled(true);
        System.out.println(horarios);
        // Si no hay horarios, volver.
        if (horarios.isEmpty()) {
            System.out.println("ERROR: No se asiste al alumno, no hay horarios para este turno.");

            MqttResponseAsistenciaWrapper wrapper = new MqttResponseAsistenciaWrapper(null, MqttResponse.NO_HORARIO);

            return wrapper;
        }

        // Filtrar aquellas en las que el alumno no se haya retirado
        asistencias.stream().filter(asistencia -> asistencia.getHorarioRetiro() == null)
                .collect(Collectors.toList());

        if (!asistencias.isEmpty()) {
            System.out.println("ERROR: El alumno todavía sigue en el turno, intentando retirar...");
            MqttResponseAsistenciaWrapper wrapper = new MqttResponseAsistenciaWrapper(null, MqttResponse.RETIRAR);

            return wrapper;
        }

        // Filtrar aquellos horarios que sean anteriores a la hora actual
        horarios.stream().filter(horario -> horario.getHorarioSalida().isAfter(LocalTime.now()))
                .collect(Collectors.toList());

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
        newAsistencia.setDia(horario.getDia());
        newAsistencia.setAsistencia(true);
        MqttResponseAsistenciaWrapper wrapper = new MqttResponseAsistenciaWrapper(
                asistenciaRepository.save(newAsistencia), MqttResponse.OK);

        return wrapper;
    }

}
