package eetp612.com.ar.asisbiom.stats;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StatsService {

    @Autowired
    private StatsRepository repository;

    // public StatsService() {
    //     Optional<Stats> info_diaria = repository.findById(StatsConfigs.INFO_DIARIA);
    //     Optional<Stats> info_cantidad = repository.findById(StatsConfigs.INFO_CANTIDADES);

    //     if (!info_cantidad.isPresent())
    //         repository.save(new Stats(StatsConfigs.INFO_CANTIDADES));
    //     if (!info_diaria.isPresent())
    //         repository.save(new Stats(StatsConfigs.INFO_DIARIA));
    // }

    public void reset() {
        Stats presentes = repository.findById(StatsConfigs.INFO_DIARIA).get();
        presentes.setCantidadAlumnos(0);
        presentes.setCantidadPersonal(0);
    }

    public void addAlumnoToPresentes() {
        Stats presentes = repository.findById(StatsConfigs.INFO_DIARIA).get();
        presentes.setCantidadAlumnos(presentes.getCantidadAlumnos() + 1);
        repository.save(presentes);
    }

    public void addPersonalToPresentes() {
        Stats presentes = repository.findById(StatsConfigs.INFO_DIARIA).get();
        presentes.setCantidadPersonal(presentes.getCantidadPersonal() + 1);
        repository.save(presentes);
    }

    public void addAlumno() {
        Stats cantidades = repository.findById(StatsConfigs.INFO_CANTIDADES).get();
        cantidades.setCantidadAlumnos(cantidades.getCantidadAlumnos() + 1);
        repository.save(cantidades);
    }

    public void addPersonal() {
        Stats cantidades = repository.findById(StatsConfigs.INFO_CANTIDADES).get();
        cantidades.setCantidadPersonal(cantidades.getCantidadPersonal() + 1);
        repository.save(cantidades);
    }

}
