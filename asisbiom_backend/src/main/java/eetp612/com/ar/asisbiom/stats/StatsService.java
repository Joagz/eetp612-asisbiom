package eetp612.com.ar.asisbiom.stats;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import eetp612.com.ar.asisbiom.alumnos.Alumno;
import eetp612.com.ar.asisbiom.alumnos.AlumnoRepository;
import eetp612.com.ar.asisbiom.asistencias.Asistencia;
import eetp612.com.ar.asisbiom.asistencias.AsistenciaRepository;
import eetp612.com.ar.asisbiom.conteoasistencias.ConteoAsistencia;
import eetp612.com.ar.asisbiom.conteoasistencias.ConteoRepository;
import eetp612.com.ar.asisbiom.general.Dia;
import eetp612.com.ar.asisbiom.horarios.Horario;
import eetp612.com.ar.asisbiom.horarios.HorarioRepository;

@Service
public class StatsService {

    // ** Conteo de personal **

    @Autowired
    private StatsRepository repository;

    @Autowired
    private HorarioRepository horarioRepository;

    @Autowired
    private AsistenciaRepository asistenciaRepository;

    @Autowired
    private ConteoRepository conteoRepository;

    @Autowired
    private AlumnoRepository alumnoRepository;

    // public StatsService() {
    // Optional<Stats> info_diaria = repository.findById(StatsConfigs.INFO_DIARIA);
    // Optional<Stats> info_cantidad =
    // repository.findById(StatsConfigs.INFO_CANTIDADES);

    // if (!info_cantidad.isPresent())
    // repository.save(new Stats(StatsConfigs.INFO_CANTIDADES));
    // if (!info_diaria.isPresent())
    // repository.save(new Stats(StatsConfigs.INFO_DIARIA));
    // }

    public int addNextFinger()
    {
        Stats finger = repository.findById(StatsConfigs.NEXT_FINGER).get();
        finger.setValor(finger.getValor()+1);
        repository.save(finger);
        return finger.getValor();
    }

    public void reset() {
        Stats presentesAlumnos = repository.findById(StatsConfigs.CANTIDAD_ALUMNOS_PRESENTES).get();
        presentesAlumnos.setValor(0);
        Stats presentesPersonal = repository.findById(StatsConfigs.CANTIDAD_PERSONAL_PRESENTES).get();
        presentesPersonal.setValor(0);
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

        Integer diasHabilesTotales = alumnos.size() * diasHabiles.get(0).getValor();
        Float inasistenciasTotales = 0f;

        for (Float j : inasistencias) {
            inasistenciasTotales += j;
        }

        Float asistenciasTotales = diasHabilesTotales - inasistenciasTotales;

        return (asistenciasTotales * 100 / diasHabilesTotales);
    }

    // Calcula el porcentaje de asistencias que fueron puntuales
    public Integer porcentajePuntualidad() {
        List<Stats> diasHabiles = repository.findByTipo(StatsConfigs.DIAS_HABILES);
        List<Integer> tardanzas = new ArrayList<>();
        List<ConteoAsistencia> alumnos = conteoRepository.findAll();

        if (alumnos.isEmpty()) {
            return 0;
        }

        if (diasHabiles.isEmpty()) {
            return -1;
        }

        alumnos.forEach(alumno -> tardanzas.add(alumno.getTardanzas()));

        Integer diasHabilesTotales = alumnos.size() * diasHabiles.get(0).getValor();
        Integer totalTardanzas = 0;

        for (Integer tardanza : tardanzas) {
            totalTardanzas += tardanza;
        }

        Integer asistenciasPuntuales = diasHabilesTotales - totalTardanzas;

        return (asistenciasPuntuales * 100) / diasHabilesTotales;
    }

    /*
     * Obtener la diferencia promedio en el horario de llegada de toda la semana
     * (se calcula con los datos registrados hasta la fecha actual)
     */
    public Integer diferenciaPromedioDeLlegada() {
        return (diferenciaPromedioDeLlegada(Dia.LUNES) +
                diferenciaPromedioDeLlegada(Dia.MARTES) +
                diferenciaPromedioDeLlegada(Dia.MIERCOLES) +
                diferenciaPromedioDeLlegada(Dia.JUEVES) +
                diferenciaPromedioDeLlegada(Dia.VIERNES)) / 5;
    }

    public Integer getDiferenciaHorarioPromedio(Alumno alumno, Dia dia) {
        // Lo haremos respecto al horario de llegada esperado
        List<Horario> horarios = horarioRepository.findByCursoAndDiaOrderByDiaAsc(alumno.getCurso(), dia);

        if (horarios.isEmpty()) {
            return -1;
        }

        Horario horario = horarios.get(0);

        // A su vez, con respecto a la cantidad de asistencias
        List<Asistencia> asistencias = asistenciaRepository.findByAlumnoAndDia(alumno, dia);
        List<Integer> minutos = new ArrayList<>();

        for (Asistencia asistencia : asistencias) {
            LocalTime horarioEntrada = asistencia.getHorarioEntrada();
            LocalTime horarioEsperado = horario.getHorarioEntrada();

            Integer horarioEntradaInt = (horarioEntrada.getHour() * 60 + horarioEntrada.getMinute());
            Integer horarioEsperadoInt = (horarioEsperado.getHour() * 60 + horarioEsperado.getMinute());

            // Agregamos la diferencia en los horario de entrada
            minutos.add(horarioEsperadoInt - horarioEntradaInt);
        }

        Integer suma = 0;

        for (Integer i : minutos) {
            suma += i;
        }
        if (minutos.size() == 0)
            return -1;
        return suma / minutos.size();
    }

    /*
     * Obtener la diferencia promedio en el horario de llegada de un día de la
     * semana (se calcula con los datos registrados hasta la fecha actual)
     * 
     * Esta métrica nos dará información sobre el horario de llegada
     * promedio de todos los alumnos, con respecto del horario de llegada
     * del horario dado.
     * 
     * Si el alumno llega siempre tarde, el resultado debería dar un promedio
     * negativo, en el caso contrario, un número positivo. Si la mayoría de veces
     * el alumno es puntual debería dar cerca de cero.
     * 
     * Este resultado nos da información del horario de llegada promedio en un día
     * de todos los alumnos, si queremos tener el horario de llegada promedio total
     * simplemente tome este valor para todos los días y dividalo entre el total
     * de días
     */
    public Integer diferenciaPromedioDeLlegada(Dia dia) {

        List<Alumno> alumnos = alumnoRepository.findAll();
        List<Integer> hprom = new ArrayList<>();

        // Calcularemos la diferencia promedio de llegada de todos los alumnos
        for (Alumno alumno : alumnos) {
            hprom.add(getDiferenciaHorarioPromedio(alumno, dia));
        }

        // Hallamos la diferencia de llegada promedio

        Integer suma = 0;

        for (Integer i : hprom) {
            suma += i;
        }
        if (hprom.size() == 0)
            return -1;
        return suma / hprom.size();
    }

    // Retorna un listado de el puntaje de cada alumno por día
    public List<Float> getPuntaje() {
        List<Alumno> alumnos = alumnoRepository.findAll();
        List<Stats> foundDiasHabiles = repository.findByTipo(StatsConfigs.DIAS_HABILES);
        List<Float> puntaje = new ArrayList<>();

        if (foundDiasHabiles.isEmpty()) {
            return null;
        }

        Integer diasHabiles = foundDiasHabiles.get(0).getValor();

        for (Alumno alumno : alumnos) {
            Float suma = 0f;
            List<Horario> horarios = horarioRepository.findByCurso(alumno.getCurso());

            if (horarios.isEmpty()) {
                continue;
            }

            List<Asistencia> asistencias = asistenciaRepository.findByAlumno(alumno);

            if (asistencias.isEmpty()) {
                continue;
            }

            int cantidadAsistencias = asistencias.size();

            if (diasHabiles == 0) {
                return null;
            }

            Float deltaX = (cantidadAsistencias / (float) diasHabiles);
            for (Horario horario : horarios) {
                for (Asistencia asistencia : asistencias) {
                    LocalTime horarioEntrada = asistencia.getHorarioEntrada();
                    LocalTime horarioEsperado = horario.getHorarioEntrada();

                    Integer horarioEntradaInt = (horarioEntrada.getMinute());
                    Integer horarioEsperadoInt = (horarioEsperado.getMinute());

                    suma += (horarioEsperadoInt - horarioEntradaInt);
                }
            }

            suma = suma * deltaX;
            puntaje.add(suma);
        }

        return puntaje;
    }
    
    public List<Float> getPuntajePositivo()
    {
        List<Float> puntaje = getPuntaje();
        List<Float> positivePuntaje = new ArrayList<>();
        
        Collections.sort(puntaje);

        Float min = puntaje.get(0);

        puntaje.forEach(p -> positivePuntaje.add(p - min));

        return positivePuntaje;
    }
    
    public List<Float> curvaLorenz() {
        List<Float> puntaje = getPuntajePositivo();
        List<Float> suma = new ArrayList<>();
        List<Float> puntos = new ArrayList<>();
        
        if (puntaje.isEmpty()) {
            return null;
        }

        // Compute cumulative sums
        Float acumulado = 0f;
        Float total = 0f;
        for (Float score : puntaje) {
            acumulado += score;
            suma.add(acumulado);
        }

        total = suma.get(suma.size() - 1);

        if (total == 0) {
            return null;
        }

        // Normalize cumulative sums
        for (Float sum : suma) {
            puntos.add(sum / total);
        }

        return puntos;
    }

    public Float indiceGini() {
        List<Float> lorenz = curvaLorenz();
        List<Float> giniSum = new ArrayList<>();
        float gini = 0f;
        
        if(lorenz.isEmpty()) return -1f;

        for (int i = 0; i < lorenz.size(); i++) {
            float x = (float) i / (float) lorenz.size();

            giniSum.add(x - lorenz.get(i));
        }

        float deltaX = 1f/(float)giniSum.size();

        for(int j = 0; j < giniSum.size(); j++)
        {
            gini+=giniSum.get(j);
        }

        gini = gini*deltaX;
        
        return 2*gini;

    }

}
