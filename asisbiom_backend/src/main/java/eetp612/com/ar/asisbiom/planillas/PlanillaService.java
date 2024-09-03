package eetp612.com.ar.asisbiom.planillas;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
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

    private Dia nextDia(Dia dia) {
        if (dia.ordinal() == Dia.values().length - 1) {
            dia = Dia.LUNES;
        } else {
            dia = Dia.values()[dia.ordinal() + 1];
        }
        return dia;
    }

    private String resolveFilename(Curso curso, Mes mes) {

        StringBuilder sb = new StringBuilder();

        String filename = null;

        sb.append("planilla_" + mes.name() + "_" + Year.now().getValue() + "_" + curso.getCurso() + curso.getDivision()
                + ".csv");

        filename = sb.toString();

        return filename;
    }

    public boolean isWithin30MinutesRange(Asistencia asistencia, Horario horario) {
        LocalTime entradaAsistencia = asistencia.getHorarioEntrada();
        LocalTime entradaHorario = horario.getHorarioEntrada();

        // Definir el rango de 30 minutos alrededor del horario de entrada
        LocalTime inicioRango = entradaHorario.minusMinutes(30);
        LocalTime finRango = entradaHorario.plusMinutes(30);

        // Verificar si el horario de entrada de la asistencia está dentro del rango
        return (entradaAsistencia.isAfter(inicioRango) || entradaAsistencia.equals(inicioRango)) &&
                (entradaAsistencia.isBefore(finRango) || entradaAsistencia.equals(finRango));
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

        planillaFileModel.setFilename(resolveFilename(curso, mes));
        planillaFileModel.setKeys(keys);
        planillaFileModel.setNAlumnos(alumnos.size());
        planillaFileModel.setNDias(dias);
        planillaFileModel.setAlumnos(alumnos);

        int indexAlumno = 0;
        int indexDay = 0;

        // Procesamiento de los datos
        for (Alumno alumno : alumnos) {
            float faltasJMes = 0f;
            float faltasInjMes = 0f;
            YearMonth year = YearMonth.of(Year.now().getValue(), mes.ordinal() + 1);
            Dia dia = Dia.values()[year.atDay(1).getDayOfWeek().ordinal()];

            System.out.println("EL MES " + mes.name() + " EMPIEZA EL DÍA " + dia.name());

            for (indexDay = 0; indexDay < dias; indexDay++) {
                if (!checkDia(mes, indexDay + 1)) {
                    break; // terminamos el loop si sobrepasamos la fecha del día actual
                }

                int key = PlanillaKey.AUSENTE;
                YearMonth yearMonth = YearMonth.of(Year.now().getValue(), mes.ordinal() + 1);
                LocalDate dayOfMonth = yearMonth.atDay(indexDay + 1);
                List<Horario> horarios = horarioRepository.findByCursoAndDiaOrderByDiaAsc(curso, dia);

                if (dia.equals(Dia.SABADO) || dia.equals(Dia.DOMINGO)) {
                    System.out.println("DIA NO HABIL");
                    key = PlanillaKey.NO_HABIL;
                    dia = nextDia(dia);
                    keys[indexAlumno][indexDay] = key;
                    continue;
                }

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

                if (horarios.size() > 1 && foundAsistencia.size() == horarios.size()) {
                    System.out.println("Found more than 1");
                    key = PlanillaKey.CON_TALLER;

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

                        key = key | (PlanillaKey.PRESENTE << offset);
                        horarioIndex++;
                        offset += 4;
                    }
                }

                if (foundAsistencia.isEmpty()) {
                    if (!horarios.isEmpty()) {
                        key = PlanillaKey.AUSENTE; // ausente
                        System.out.println("no hay asistencias");
                        List<FaltaJustificada> faltas = faltaJustificadaRepository.findByAlumnoAndFecha(alumno,
                                dayOfMonth);
                        if (!faltas.isEmpty()) {
                            int offset = 0;
                            for (FaltaJustificada f : faltas) {
                                faltasJMes += f.getValor();
                                key = key | (PlanillaKey.JUSTIFICADO << offset);
                            }
                        } else {
                            faltasInjMes += inasistenciaPorTurno;
                        }
                    }
                }

                if (foundAsistencia.size() == 1) {
                    int offset = 0;
                    System.out.println(horarios);
                    for (Horario horario : horarios) {
                        Asistencia asistencia = foundAsistencia.get(0);

                        if (horarios.size() > 1 && !isWithin30MinutesRange(asistencia, horario)) {

                            key = key | PlanillaKey.CON_TALLER;
                            List<FaltaJustificada> faltas = faltaJustificadaRepository.findByAlumnoAndFecha(alumno,
                                    dayOfMonth);
                            if (!faltas.isEmpty()) {
                                for (FaltaJustificada f : faltas) {
                                    faltasJMes += f.getValor();
                                    key = key | (PlanillaKey.JUSTIFICADO << offset);
                                }
                            } else {
                                faltasInjMes += horario.getValorInasistencia();
                            }

                            offset += 4;
                            continue;
                        }

                        if (asistencia.getTardanza()) {
                            if (asistencia.getHorarioEntrada().isAfter(horario.getHorarioEntrada().plusMinutes(15)))
                                faltasInjMes += inasistenciaPorTurno;
                            else
                                faltasInjMes += inasistenciaPorTurno * 0.5f;
                            System.out.println("SUMANDO TARDANZA...");
                            key = key | (PlanillaKey.TARDANZA << offset);
                        }

                        if (asistencia.getRetirado()) {
                            if (asistencia.getHorarioRetiro()
                                    .isBefore(horario.getHorarioEntrada().plusMinutes(VALOR_HORA_MINUTO * 4)))
                                faltasJMes += inasistenciaPorTurno;
                            else
                                faltasJMes += inasistenciaPorTurno * 0.5f;
                        }
                        key = key | (PlanillaKey.PRESENTE << offset);
                        offset += 4;
                    }
                }

                // System.out.println("<<<<< KEY >>>>>: " + Integer.toBinaryString(key));

                dia = nextDia(dia);

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

    private String resolveStringForKey(int key) {
        StringBuilder sb = new StringBuilder();
        int offset = 0;
        int maxHorarios = 1;
        // System.err.println("KEY AT 9th bit: " + (key & 0b100000000));
        if ((key & 0b111100000000) == 0b111100000000) {
            maxHorarios = 2;
        }

        if (key == PlanillaKey.NO_HABIL) {
            return "-";
        }

        for (int i = 0; i < maxHorarios; i++) {
            switch ((key >> offset) & 0b000000001111) {
                case PlanillaKey.AUSENTE:
                    sb.append("A");
                    break;

                case PlanillaKey.AUSENTE | PlanillaKey.JUSTIFICADO:
                    sb.append("A_j");
                    break;

                case PlanillaKey.PRESENTE:
                    sb.append("P");
                    break;

                case PlanillaKey.PRESENTE | PlanillaKey.TARDANZA:
                    sb.append("P^t");
                    break;
                default:
                    sb.append("-");
                    break;
            }
            offset += 4;
        }

        return sb.toString();
    }

    @Override
    public Planilla nuevaPlanillaMensual(Mes mes, int cursoId) {

        Planilla planilla = new Planilla();
        PlanillaFileModel fileModel = planillaFileModelInit(mes, cursoId);

        if (fileModel == null) {
            return null;
        }

        Optional<Curso> curso = cursoRepository.findById(cursoId);

        if (curso.isEmpty()) {
            return null;
        }

        File file = new File(datapath + fileModel.getFilename());

        try (FileOutputStream outputStream = new FileOutputStream(file)) {

            StringBuilder sb = new StringBuilder();
            String header = "Alumnos,";

            sb.append(header);

            // inicializar el archivo
            for (int i = 0; i < fileModel.getNDias(); i++) {
                sb.append(i + 1 + ",");
            }

            sb.append("faltasJMes, faltasInjMes, faltasJ, faltasInj\n");

            header = sb.toString();

            outputStream.write(header.getBytes());
            outputStream.flush();

            int j = 0, k = 0;
            sb.delete(0, sb.length());

            for (Alumno alumno : fileModel.getAlumnos()) {
                sb.append(alumno.getNombreCompleto() + ",");

                for (k = 0; k < fileModel.getNDias(); k++) {
                    sb.append(resolveStringForKey(fileModel.getKeys()[j][k]) + ",");
                }

                sb.append(fileModel.getInasistenciasMes()[j][0] + ",");
                sb.append(fileModel.getInasistenciasMes()[j][1] + ",");

                sb.append(fileModel.getInasistenciasAnio()[j][0] + ",");
                sb.append(fileModel.getInasistenciasAnio()[j][1]);
                sb.append("\n");

                outputStream.write(sb.toString().getBytes());
                outputStream.flush();

                sb.delete(0, sb.length());

                j++;
            }

        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
            return null;
        }

        planilla.setFileNameFull(file.getAbsolutePath());
        planilla.setFileName(fileModel.getFilename());
        return planilla;
    }

}
