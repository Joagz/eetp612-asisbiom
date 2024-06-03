package eetp612.com.ar.asisbiom.schedule;

import java.time.Duration;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import eetp612.com.ar.asisbiom.asistencias.Asistencia;
import eetp612.com.ar.asisbiom.asistencias.AsistenciaRepository;
import eetp612.com.ar.asisbiom.conteoasistencias.ConteoRepository;
import eetp612.com.ar.asisbiom.general.DateUtils;
import eetp612.com.ar.asisbiom.horarios.Horario;
import eetp612.com.ar.asisbiom.horarios.HorarioRepository;
import eetp612.com.ar.asisbiom.horarios.HorarioUtils;

@Configuration
@EnableScheduling
public class ScheduleConfig {

    @Autowired
    private ConteoRepository conteoRepository;

    @Autowired
    private AsistenciaRepository asistenciaRepository;

    @Autowired
    private HorarioRepository horarioRepository;

    // Esto hace el recuento de faltas al final del día
    @Scheduled(fixedRate = 24, timeUnit = TimeUnit.HOURS)
    public void scheduleFixedRateTaskAsync() throws InterruptedException {
        conteoRepository.findAll().forEach(conteo -> {

            List<Asistencia> asistencias = asistenciaRepository.findByAlumnoAndFecha(conteo.getAlumno(),
                    LocalDate.now());

            List<Horario> horarios = horarioRepository.findByCursoAndDiaOrderByDiaAsc(conteo.getAlumno().getCurso(),
                    DateUtils.getDay());

            Float inasistencia = 0f;

            int i = 0;
            ArrayList<Integer> toDelete = new ArrayList<>();

            for (Horario h : horarios) {
                for (Asistencia a : asistencias) {
                    long minutesBetween = Math
                            .abs(Duration.between(h.getHorarioEntrada(), a.getHorarioEntrada()).toMinutes());
                    System.out.println("MINUTES BETWEEN : " + minutesBetween);

                    if (minutesBetween <= 15) {
                        toDelete.add(i);
                        break;
                    }
                }
                i++;
            }

            for (int k : toDelete) {
                horarios.remove(k);
            }

            for (Horario horario : horarios) {
                System.out.println(horario.getValorInasistencia());
                inasistencia += horario.getValorInasistencia();
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

            conteo.setDiasHabiles(conteo.getDiasHabiles() + 1);
            conteoRepository.save(conteo);
        });
    }

}