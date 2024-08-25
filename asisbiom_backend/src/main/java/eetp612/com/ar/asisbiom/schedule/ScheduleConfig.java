package eetp612.com.ar.asisbiom.schedule;

import java.time.Duration;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import eetp612.com.ar.asisbiom.alumnos.Alumno;
import eetp612.com.ar.asisbiom.asistencias.Asistencia;
import eetp612.com.ar.asisbiom.asistencias.AsistenciaRepository;
import eetp612.com.ar.asisbiom.conteoasistencias.ConteoRepository;
import eetp612.com.ar.asisbiom.docentes.Roles;
import eetp612.com.ar.asisbiom.general.DateUtils;
import eetp612.com.ar.asisbiom.horarios.Horario;
import eetp612.com.ar.asisbiom.horarios.HorarioRepository;
import eetp612.com.ar.asisbiom.horarios.HorarioUtils;
import eetp612.com.ar.asisbiom.notas.NotaRepository;
import eetp612.com.ar.asisbiom.notification.Notification;
import eetp612.com.ar.asisbiom.notification.NotificationService;
import eetp612.com.ar.asisbiom.stats.StatsService;
import eetp612.com.ar.asisbiom.user.User;
import eetp612.com.ar.asisbiom.user.UserRepository;

@Configuration
@EnableScheduling
public class ScheduleConfig {

    // Tiempo máximo para contar una asistencia
    static final int TIEMPO_MAXIMO_ENTRADA_MINS = 30;
    static final int RACHA_INASISTENCIA_MAX_DIAS = 3;

    @Autowired
    private ConteoRepository conteoRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AsistenciaRepository asistenciaRepository;

    @Autowired
    private HorarioRepository horarioRepository;

    @Autowired
    private StatsService statsService;

    @Autowired
    private NotaRepository notaRepository;

    @Autowired
    private NotificationService notificationService;

    private String defaultNotificationForAbsentStudentStreak(Alumno s, int dias) {
        return "El alumno " + s.getNombreCompleto() + ", DNI " + s.getDni() + " estuvo austente" + dias
                + " dias.";
    }

    // Procesar notificaciones programadas
    @Scheduled(cron = "0 0 7 * * MON-FRI", zone = "GMT-3")
    public void notificationScheduler() throws InterruptedException {

        // Enviar notificaciones predeterminadas a roles mayores a preceptor
        List<User> usuarios = userRepository.findAll().stream()
                .filter(user -> !user.getRole().equals(Roles.SENSOR)
                        && (user.getRole().ordinal() >= Roles.PRECEPTOR.ordinal()))
                .collect(Collectors.toList());

        // Enviar notificación de alumno ausente (en racha)
        conteoRepository.findAll().forEach(conteo -> {
            usuarios.forEach(usuario -> {

                if (conteo.getRacha() >= RACHA_INASISTENCIA_MAX_DIAS) {
                    Notification notification = notificationService.createNotification(usuario,
                            defaultNotificationForAbsentStudentStreak(conteo.getAlumno(), conteo.getRacha()));
                    notification.setUrgencia(1);
                    notificationService.sendNotification(notification);
                }
            });
        });
    }

    // recuento de faltas al final del día
    // borrar notas vencidas
    @Scheduled(cron = "0 0 19 * * MON-FRI", zone = "GMT-3")
    public void asistenciaScheduler() throws InterruptedException {

        notaRepository.findAll().stream().forEach(nota -> {
            if (nota.getVencimiento().isBefore(LocalDate.now())) {
                notaRepository.delete(nota);
            }
        });

        conteoRepository.findAll().forEach(conteo -> {

            statsService.reset();

            List<Asistencia> asistencias = asistenciaRepository.findByAlumnoAndFecha(conteo.getAlumno(),
                    LocalDate.now());

            List<Horario> horarios = horarioRepository.findByCursoAndDiaOrderByDiaAsc(conteo.getAlumno().getCurso(),
                    DateUtils.getDay());

            Float inasistencia = 0f;
            boolean inasistenciasEnRacha = false;

            // turnos_ausente sirve para cuantificar si el alumno vino no, y en base a eso
            // notificar
            // al preceptor si tiene una racha de inasistencias (de 3 días, por ejemplo)
            int i = 0, turnos_ausente = horarios.size();

            // filtrar horarios y eliminar aquellos cuyo horario de entrada
            // haya estado en un rango de 15 minutos
            for (Horario h : horarios) {
                for (Asistencia asistencia : asistencias) {
                    long minutesBetween = Math
                            .abs(Duration.between(h.getHorarioEntrada(), asistencia.getHorarioEntrada()).toMinutes());
                    // Colocar horario de salida si no se retiró el alumno
                    if (asistencia.getHorarioRetiro() == null) {
                        asistencia.setHorarioRetiro(h.getHorarioSalida());
                    }

                    // Removemos todas las asistencias válidas de la
                    // lista, ya que a las que queden se les colocará
                    // inasistencia en el conteo
                    if (minutesBetween <= TIEMPO_MAXIMO_ENTRADA_MINS && asistencia.isEnabled()) {
                        horarios.remove(i);
                        turnos_ausente--;
                        break;
                    } else if (minutesBetween > TIEMPO_MAXIMO_ENTRADA_MINS && asistencia.isEnabled()) {
                        // A pesar de llegar tarde, el alumno asistió
                        turnos_ausente--;
                        break;
                    }
                }
                i++;
            }

            for (Horario horario : horarios) {
                System.out.println(horario.getValorInasistencia());
                inasistencia += horario.getValorInasistencia();
            }

            if (turnos_ausente == horarios.size()) {
                conteo.setRacha(conteo.getRacha() + 1);
                inasistenciasEnRacha = true;
            } else {
                conteo.setRacha(0);
            }

            switch (HorarioUtils.getActualTrimestre()) {
                case 1:
                    conteo.setInasistencias1(conteo.getInasistencias1() + inasistencia);
                    break;
                case 2:
                    conteo.setInasistencias2(conteo.getInasistencias2() + inasistencia);
                    break;
                case 3:
                    conteo.setInasistencias3(conteo.getInasistencias3() + inasistencia);
                    break;
            }

            conteo.setInasistenciasEnRacha(inasistenciasEnRacha);
            conteo.setDiasHabiles(conteo.getDiasHabiles() + 1);
            conteoRepository.save(conteo);
        });
    }

}