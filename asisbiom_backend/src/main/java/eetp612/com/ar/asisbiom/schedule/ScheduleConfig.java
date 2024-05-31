package eetp612.com.ar.asisbiom.schedule;

import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import eetp612.com.ar.asisbiom.conteoasistencias.ConteoRepository;

@Configuration
@EnableScheduling
public class ScheduleConfig {

    @Autowired
    private ConteoRepository conteoRepository;

    @Scheduled(fixedRate = 24, timeUnit = TimeUnit.HOURS)
    public void scheduleFixedRateTaskAsync() throws InterruptedException {
        conteoRepository.findAll().forEach(conteo -> {
            conteo.setDiasHabiles(conteo.getDiasHabiles() + 1);
            conteoRepository.save(conteo);
        });
    }

}