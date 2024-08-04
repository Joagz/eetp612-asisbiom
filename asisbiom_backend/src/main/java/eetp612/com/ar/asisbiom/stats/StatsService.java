package eetp612.com.ar.asisbiom.stats;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import eetp612.com.ar.asisbiom.conteoasistencias.ConteoAsistencia;
import eetp612.com.ar.asisbiom.conteoasistencias.ConteoRepository;

@Service
public class StatsService {

    // ** Conteo de personal **

    @Autowired
    private StatsRepository repository;

    @Autowired
    private ConteoRepository conteoRepository;

    // public StatsService() {
    // Optional<Stats> info_diaria = repository.findById(StatsConfigs.INFO_DIARIA);
    // Optional<Stats> info_cantidad =
    // repository.findById(StatsConfigs.INFO_CANTIDADES);

    // if (!info_cantidad.isPresent())
    // repository.save(new Stats(StatsConfigs.INFO_CANTIDADES));
    // if (!info_diaria.isPresent())
    // repository.save(new Stats(StatsConfigs.INFO_DIARIA));
    // }

    public void reset() {
        Stats presentesAlumnos = repository.findById(StatsConfigs.CANTIDAD_ALUMNOS_PRESENTES).get();
        presentesAlumnos.setValor(0l);
        Stats presentesPersonal = repository.findById(StatsConfigs.CANTIDAD_PERSONAL_PRESENTES).get();
        presentesPersonal.setValor(0l);
    }

    public void addAlumnoToPresentes() {
        Stats presentes = repository.findById(StatsConfigs.CANTIDAD_ALUMNOS_PRESENTES).get();
        presentes.setValor(presentes.getValor() + 1);
        repository.save(presentes);
    }

    public void addPersonalToPresentes() {
        Stats presentes = repository.findById(StatsConfigs.CANTIDAD_PERSONAL_PRESENTES).get();
        presentes.setValor(presentes.getValor() + 1);
        repository.save(presentes);
    }

    public void addAlumno() {
        Stats cantidades = repository.findById(StatsConfigs.CANTIDAD_ALUMNOS).get();
        cantidades.setValor(cantidades.getValor() + 1);
        repository.save(cantidades);
    }

    public void addPersonal() {
        Stats cantidades = repository.findById(StatsConfigs.CANTIDAD_PERSONAL).get();
        cantidades.setValor(cantidades.getValor() + 1);
        repository.save(cantidades);
    }

    // ** Estadísticas **

    // Calcula el porcentaje de asistencias dada la cantidad de días hábiles actual
    public Float porcentajeAsistencias() {

        List<Stats> diasHabiles = repository.findByTipo(StatsConfigs.DIAS_HABILES);
        List<Float> inasistencias = new ArrayList<>();
        List<ConteoAsistencia> alumnos = conteoRepository.findAll();

        if (alumnos.isEmpty()) {
            return 0f;
        }

        if (diasHabiles.isEmpty()) {
            return -1f;
        }

        // Conseguimos todas las inasistencias del alumno a la fecha actual,
        // da igual el trimestre que sea, si la fecha actual entra en el primer
        // trimestre, el segundo y tercer trimestre tendrán 0 inasistencias
        alumnos.forEach(
                alumno -> inasistencias
                        .add(alumno.getInasistencias1() + alumno.getInasistencias2() + alumno.getInasistencias3()));

        Long diasHabilesTotales = alumnos.size() * diasHabiles.get(0).getValor();
        Float inasistenciasTotales = 0f;

        for (Float j : inasistencias) {
            inasistenciasTotales += j;
        }

        Float asistenciasTotales = diasHabilesTotales - inasistenciasTotales;

        return (asistenciasTotales * 100 / diasHabilesTotales);
    }

    // Calcula el porcentaje de asistencias que fueron puntuales
    public Long porcentajePuntualidad() {
        List<Stats> diasHabiles = repository.findByTipo(StatsConfigs.DIAS_HABILES);
        List<Integer> tardanzas = new ArrayList<>();
        List<ConteoAsistencia> alumnos = conteoRepository.findAll();

        if (alumnos.isEmpty()) {
            return 0l;
        }

        if (diasHabiles.isEmpty()) {
            return -1l;
        }

        alumnos.forEach(alumno -> tardanzas.add(alumno.getTardanzas()));

        Long diasHabilesTotales = alumnos.size() * diasHabiles.get(0).getValor();
        Integer totalTardanzas = 0;

        for (Integer tardanza : tardanzas) {
            totalTardanzas += tardanza;
        }

        Long asistenciasPuntuales = diasHabilesTotales - totalTardanzas;

        return (asistenciasPuntuales * 100) / diasHabilesTotales;
    }

    

}
