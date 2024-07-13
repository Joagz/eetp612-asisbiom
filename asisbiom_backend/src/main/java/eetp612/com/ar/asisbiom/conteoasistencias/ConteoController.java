
/*
 * Autor: Joaquín Gómez 
 * EETP N.612 "Eudocio de los Santos Giménez", Coronda, Santa Fe
 */
package eetp612.com.ar.asisbiom.conteoasistencias;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import eetp612.com.ar.asisbiom.alumnos.Alumno;
import eetp612.com.ar.asisbiom.alumnos.AlumnoRepository;
import eetp612.com.ar.asisbiom.asistencias.Asistencia;
import eetp612.com.ar.asisbiom.asistencias.AsistenciaRepository;
import eetp612.com.ar.asisbiom.cursos.Curso;
import eetp612.com.ar.asisbiom.cursos.CursoRepository;
import eetp612.com.ar.asisbiom.stats.Stats;
import eetp612.com.ar.asisbiom.stats.StatsConfigs;
import eetp612.com.ar.asisbiom.stats.StatsRepository;

record InnerConteoAsistencia(
        Integer id,
        String nombreCompleto,
        Boolean tardanza,
        Boolean retirado,
        Boolean presente,
        Long diasHabiles,
        Float inasistencias1,
        Float inasistencias2,
        Float inasistencias3) {
}

@RestController
@RequestMapping("/api/estadistica")
public class ConteoController {

    String[] RESUME_FILE_HEADERS = {
            "Nombre Completo",
            "tardanza",
            "retirado",
            "presente",
            "diasHabiles",
            "inasistencias1",
            "inasistencias2",
            "inasistencias3" };

    @Autowired
    private ConteoRepository conteoRepository;

    @Autowired
    private AlumnoRepository alumnoRepository;

    @Autowired
    private CursoRepository cursoRepository;

    @Autowired
    private StatsRepository statsRepository;

    @Autowired
    private AsistenciaRepository asistenciaRepository;

    @GetMapping("")
    public ResponseEntity<?> findAll() {
        return ResponseEntity.ok().body(conteoRepository.findAll());
    }

    // Aclaracion importante: En este caso no se tiene en cuenta el contraturno para
    // la toma
    // de la asistencia. El metodo encuentra el listado de alumnos del curso y
    // devuelve un resumen
    @GetMapping("/{curso}")
    public ResponseEntity<?> findStudentsByCourseAndGetResume(@PathVariable("curso") Integer cursoId) {

        Optional<Curso> foundCurso = cursoRepository.findById(cursoId);

        if (foundCurso.isPresent()) {
            Curso curso = foundCurso.get();

            List<Alumno> alumnos = alumnoRepository.findByCurso(curso);

            List<InnerConteoAsistencia> stats = new ArrayList<>();

            alumnos.forEach(alumno -> {
                List<ConteoAsistencia> foundConteoAlumno = conteoRepository.findByAlumno(alumno);
                if (!foundConteoAlumno.isEmpty()) {
                    ConteoAsistencia conteoAsistencia = foundConteoAlumno.get(0);
                    boolean presente = false;
                    boolean tardanza = false;
                    boolean retirado = false;
                    boolean enabled = false;

                    List<Asistencia> asistencias = asistenciaRepository.findByAlumnoAndFecha(alumno, LocalDate.now());

                    if (!asistencias.isEmpty()) {
                        Asistencia asistencia = asistencias.get(0);
                        presente = true;
                        tardanza = asistencia.getTardanza();
                        enabled = asistencia.isEnabled();
                        retirado = asistencia.getRetirado();
                    }

                    InnerConteoAsistencia innerConteoAsistencia = new InnerConteoAsistencia(alumno.getId(),
                            alumno.getNombreCompleto(), tardanza, retirado, presente && enabled, conteoAsistencia.getDiasHabiles(),
                            conteoAsistencia.getInasistencias1(), conteoAsistencia.getInasistencias2(),
                            conteoAsistencia.getInasistencias3());

                    stats.add(innerConteoAsistencia);
                }
            });
            return ResponseEntity.ok().body(stats);
        }

        return ResponseEntity.notFound().build();
    }

    @GetMapping("/cantidades")
    public ResponseEntity<?> getRecuento() {

        Optional<Stats> found = statsRepository.findById(StatsConfigs.INFO_CANTIDADES);
        if (!found.isPresent())
            return ResponseEntity.notFound().build();
        return ResponseEntity.ok().body(statsRepository.findById(StatsConfigs.INFO_CANTIDADES).get());

    }

    @GetMapping("/cantidades/diaria")
    public ResponseEntity<?> getRecuentoDiario() {
        Optional<Stats> found = statsRepository.findById(StatsConfigs.INFO_DIARIA);
        if (!found.isPresent())
            return ResponseEntity.notFound().build();
        return ResponseEntity.ok().body(statsRepository.findById(StatsConfigs.INFO_DIARIA).get());
    }

    // TODO: Remover
    @GetMapping("/_initialize")
    public String init() {
        Optional<Stats> info_diaria = statsRepository.findById(StatsConfigs.INFO_DIARIA);
        Optional<Stats> info_cantidad = statsRepository.findById(StatsConfigs.INFO_CANTIDADES);

        if (!info_cantidad.isPresent())
            statsRepository.save(new Stats(StatsConfigs.INFO_CANTIDADES));
        if (!info_diaria.isPresent())
            statsRepository.save(new Stats(StatsConfigs.INFO_DIARIA));

        return "ok";
    }

    @GetMapping("/descarga/{cursoId}")
    public ResponseEntity<?> getFileFromCursoAndDivisionEntity(@PathVariable Integer cursoId) throws IOException {
        // Depende de la plataforma donde ejecutemos

        // Windows
        // File csv = new File("\\temp\\estadistica.csv");

        // Linux
        File csv = new File("\\home\\{usr}\\tmp\\estadistica.csv");

        try (PrintWriter pw = new PrintWriter(csv)) {

            Optional<Curso> foundCurso = cursoRepository.findById(cursoId);

            if (!foundCurso.isPresent())
                return ResponseEntity.notFound().build();

            Curso curso = foundCurso.get();
            pw.write(Arrays.toString(RESUME_FILE_HEADERS).replace("[", "").replace("]", "") + "\n");

            List<Alumno> alumnos = alumnoRepository.findByCurso(curso);

            alumnos.forEach(alumno -> {
                List<ConteoAsistencia> foundConteoAlumno = conteoRepository.findByAlumno(alumno);
                if (!foundConteoAlumno.isEmpty()) {
                    ConteoAsistencia conteoAsistencia = foundConteoAlumno.get(0);
                    boolean presente = false;
                    boolean tardanza = false;
                    boolean retirado = false;

                    List<Asistencia> asistencias = asistenciaRepository.findByAlumnoAndFecha(alumno, LocalDate.now());

                    if (!asistencias.isEmpty()) {
                        Asistencia asistencia = asistencias.get(0);
                        presente = true;
                        tardanza = asistencia.getTardanza();
                        retirado = asistencia.getRetirado();
                    }

                    pw.write((alumno.getNombreCompleto() + "," + tardanza + "," + retirado + "," + presente + ","
                            + conteoAsistencia.getDiasHabiles() + "," +
                            conteoAsistencia.getInasistencias1() + "," + conteoAsistencia.getInasistencias2() + "," +
                            conteoAsistencia.getInasistencias3()));

                }
            });

        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }

        Path path = Paths.get(csv.getAbsolutePath());

        return ResponseEntity.ok().contentType(MediaType.parseMediaType("text/csv"))
                .header("Content-Disposition", "attachment; filename=estadistica.csv").body(Files.readAllBytes(path));
    }

    @PutMapping("/editar/{id}")
    public ResponseEntity<?> editarCurso(@PathVariable Integer id, @RequestBody List<InnerConteoAsistencia> alumnos) {

        if (cursoRepository.findByCurso(id).isEmpty())
            return ResponseEntity.notFound().build();

        alumnos.forEach(alumno -> {
            Optional<ConteoAsistencia> found = conteoRepository.findById(alumno.id());
            if (found.isPresent())
                conteoRepository.save(found.get());
        });

        return ResponseEntity.ok().body(" editado !");
    }

}
