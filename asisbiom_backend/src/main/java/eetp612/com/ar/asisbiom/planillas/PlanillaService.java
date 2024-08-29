package eetp612.com.ar.asisbiom.planillas;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.Year;
import java.time.YearMonth;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import eetp612.com.ar.asisbiom.alumnos.Alumno;
import eetp612.com.ar.asisbiom.alumnos.AlumnoRepository;
import eetp612.com.ar.asisbiom.asistencias.Asistencia;
import eetp612.com.ar.asisbiom.asistencias.AsistenciaRepository;
import eetp612.com.ar.asisbiom.conteoasistencias.ConteoAsistencia;
import eetp612.com.ar.asisbiom.conteoasistencias.ConteoRepository;
import eetp612.com.ar.asisbiom.cursos.Curso;
import eetp612.com.ar.asisbiom.cursos.CursoRepository;
import eetp612.com.ar.asisbiom.faltasjustificadas.FaltaJustificada;
import eetp612.com.ar.asisbiom.faltasjustificadas.FaltaJustificadaRepository;
import eetp612.com.ar.asisbiom.general.Dia;
import eetp612.com.ar.asisbiom.general.Mes;
import eetp612.com.ar.asisbiom.horarios.Horario;
import eetp612.com.ar.asisbiom.horarios.HorarioRepository;

@Service
public class PlanillaService implements IPlanillaService {

    static final int VALOR_HORA_MINUTO = 60;

    @Value("${asisbiom.datapath}")
    private String datapath;

    @Autowired
    private AlumnoRepository alumnoRepository;

    @Autowired
    private AsistenciaRepository asistenciaRepository;

    @Autowired
    private CursoRepository cursoRepository;

    @Autowired
    private FaltaJustificadaRepository faltaJustificadaRepository;

    @Autowired
    private HorarioRepository horarioRepository;

    @Autowired
    private ConteoRepository conteoRepository;

    private int resolveMesNDays(Mes mes) {
        YearMonth yearMonth = YearMonth.of(Year.now().getValue(), mes.ordinal() + 1);
        return yearMonth.lengthOfMonth();
    }

    private boolean checkMes(Mes mes) {
        YearMonth yearMonth = YearMonth.of(Year.now().getValue(), mes.ordinal() + 1);
        LocalDate now = LocalDate.now();

        if (yearMonth.atDay(1).isAfter(now)) {
            return false;
        }

        return true;
    }

    private boolean checkDia(Mes mes, int dia) {
        YearMonth yearMonth = YearMonth.of(Year.now().getValue(), mes.ordinal() + 1);
        LocalDate now = LocalDate.now();

        if (yearMonth.atDay(dia).isAfter(now)) {
            return false;
        }

        return true;
    }

    private String resolveFilename(Curso curso, Mes mes) {

        StringBuilder sb = new StringBuilder();

        String filename = null;

        sb.append("planilla_" + mes.name() + "_" + Year.now().getValue() + "_" + curso.getCurso() + curso.getDivision()
                + "_NRO_1" + ".csv");

        filename = sb.toString();

        Path path = Paths.get(filename);
        int i = 2;

        while (Files.exists(path)) {
            if (i > 2) {
                sb.delete(filename.length() - 4 + String.valueOf(i).length(), filename.length());
            } else {
                sb.delete(filename.length() - 4, filename.length());
            }
            sb.append(i + ".csv");
            filename = sb.toString();
            path = Paths.get(filename);
            i++;
        }

        return filename;
    }

    public PlanillaFileModel planillaFileModelInit(Mes mes, int cursoId) {
        if (!checkMes(mes)) {
        return null;
        }

        PlanillaFileModel planillaFileModel = new PlanillaFileModel();
        int dias = resolveMesNDays(mes);

        Optional<Curso> found = null;
        if (!(found = cursoRepository.findById(cursoId)).isPresent()) {
            return null;
        }

        Curso curso = found.get();
        List<Alumno> alumnos = alumnoRepository.findByCurso(curso);

        if (alumnos.isEmpty()) {
            return null;
        }

        int keys[][] = new int[alumnos.size()][dias];
        float inasistenciasMes[][] = new float[alumnos.size()][2];
        float inasistenciasAnio[][] = new float[alumnos.size()][2];

        planillaFileModel.setFilename(datapath + resolveFilename(curso, mes));
        planillaFileModel.setKeys(keys);

        int indexAlumno = 0;
        int indexDay = 0;

        // Procesamiento de los datos
        for (Alumno alumno : alumnos) {
            float faltasJMes = 0f;
            float faltasInjMes = 0f;
            int diaSize = Dia.values().length;
            Dia dia = Dia.LUNES;

            for (indexDay = 0; indexDay < dias; indexDay++) {
                System.out.println(dia);
                if (!checkDia(mes, indexDay + 1)) {
                    break; // terminamos el loop si sobrepasamos la fecha del día actual
                }

                int key = PlanillaKey.AUSENTE; // 0b00000000
                YearMonth yearMonth = YearMonth.of(Year.now().getValue(), mes.ordinal() + 1);
                LocalDate dayOfMonth = yearMonth.atDay(indexDay + 1);
                List<Horario> horarios = horarioRepository.findByCursoAndDiaOrderByDiaAsc(curso, dia);

                if (horarios.isEmpty()) {
                    break;
                }
                // Ordenar los horarios para que el horario de entrada más cercano esté primero.
                horarios.sort(new Comparator<Horario>() {
                    @Override
                    public int compare(Horario a, Horario b) {
                        return a.getHorarioEntrada().compareTo(b.getHorarioEntrada());
                    }
                });

                float inasistenciaPorTurno = 1;
                if (horarios.size() > 1) {
                    inasistenciaPorTurno = 1 / 2;
                }

                // pueden ser hasta 3 asistencias (educación física, contraturno o cátedra. Pero
                // ignoraremos educación física)
                List<Asistencia> foundAsistencia = asistenciaRepository.findByAlumnoAndFecha(alumno, dayOfMonth);
                foundAsistencia.sort((o1, o2) -> o1.getClase().compareTo(o2.getClase()));

                if (foundAsistencia.size() == horarios.size() && horarios.size() > 1) {
                    System.out.println("Found more than 1");
                    int horarioIndex = 0;
                    int offset = 0;
                    for (Asistencia asistencia : foundAsistencia) {
                        Horario horario = horarios.get(horarioIndex);
                        if (asistencia.getTardanza()) {
                            if (asistencia.getHorarioEntrada().isAfter(horario.getHorarioEntrada().plusMinutes(15)))
                                faltasInjMes += inasistenciaPorTurno;
                            else
                                faltasInjMes += inasistenciaPorTurno * 0.5f;

                            key += PlanillaKey.TARDANZA << offset;
                        }
                        if (asistencia.getRetirado()) {
                            if (asistencia.getHorarioRetiro()
                                    .isBefore(horario.getHorarioEntrada().plusMinutes(VALOR_HORA_MINUTO * 4)))
                                faltasJMes += inasistenciaPorTurno;
                            else
                                faltasJMes += inasistenciaPorTurno * 0.5f;
                        }

                        key += PlanillaKey.PRESENTE << offset;
                        horarioIndex++;
                        offset += 4;
                    }
                } else if (foundAsistencia.isEmpty()) {
                    if (horarios.size() > 1) {
                        System.out.println("Ausente");
                        key = PlanillaKey.AUSENTE; // ausente los dos turnos
                    }
                } else {

                    System.out.println("Found 1");
                    int offset = 0;
                    for (Horario horario : horarios) {
                        Asistencia asistencia = foundAsistencia.get(0);
                        // si el alumno se retira después del horario de salida, significa que
                        // tenemos que ir al siguiente horario
                        if (asistencia.getHorarioRetiro().isAfter(horario.getHorarioSalida())) {
                            continue;
                        }

                        if (asistencia.getTardanza()) {
                            if (asistencia.getHorarioEntrada().isAfter(horario.getHorarioEntrada().plusMinutes(15)))
                                faltasInjMes += inasistenciaPorTurno;
                            else
                                faltasInjMes += inasistenciaPorTurno * 0.5f;

                            key += PlanillaKey.TARDANZA << offset;
                        }
                        if (asistencia.getRetirado()) {
                            if (asistencia.getHorarioRetiro()
                                    .isBefore(horario.getHorarioEntrada().plusMinutes(VALOR_HORA_MINUTO * 4)))
                                faltasJMes += inasistenciaPorTurno;
                            else
                                faltasJMes += inasistenciaPorTurno * 0.5f;
                        }

                        key += PlanillaKey.PRESENTE << offset;
                        offset += 4;
                    }
                }

                System.out.println("<<<<< KEY >>>>>: " + key);

                if (dia.ordinal() == diaSize - 1) {
                    dia = Dia.LUNES;
                } else {
                    dia = Dia.values()[dia.ordinal() + 1];
                }

                keys[indexAlumno][indexDay] = key;
            }

            inasistenciasMes[indexAlumno][0] = faltasJMes;
            inasistenciasMes[indexAlumno][1] = faltasInjMes;

            for (FaltaJustificada f : faltaJustificadaRepository.findByAlumno(alumno)) {
                inasistenciasAnio[indexAlumno][0] += f.getValor();
            }

            List<ConteoAsistencia> conteoAsistencia;
            if ((conteoAsistencia = conteoRepository.findByAlumno(alumno)).isEmpty()) {
                inasistenciasAnio[indexAlumno][1] = -1f;
                break;
            }

            ConteoAsistencia c = conteoAsistencia.get(0);
            inasistenciasAnio[indexAlumno][1] = c.getInasistencias1() + c.getInasistencias2()
                    + c.getInasistencias3() - inasistenciasAnio[indexAlumno][0];

            indexAlumno++;

        }

        planillaFileModel.setInasistenciasAnio(inasistenciasAnio);
        planillaFileModel.setInasistenciasMes(inasistenciasMes);
        planillaFileModel.setKeys(keys);

        return planillaFileModel;
    }

    @Override
    public Planilla nuevaPlanillaMensual(Mes mes, int cursoId) {

        Planilla planilla = new Planilla();
        PlanillaFileModel fileModel = planillaFileModelInit(mes, cursoId);

        if (fileModel == null) {
            return null;
        }

        System.out.println(fileModel);

        return planilla;
    }

}
