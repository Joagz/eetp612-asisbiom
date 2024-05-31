
/*
 * Autor: Joaquín Gómez 
 * EETP N.612 "Eudocio de los Santos Giménez", Coronda, Santa Fe
 */
package eetp612.com.ar.asisbiom.conteoasistencias;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import eetp612.com.ar.asisbiom.alumnos.AlumnoRepository;
import eetp612.com.ar.asisbiom.cursos.Curso;
import eetp612.com.ar.asisbiom.cursos.CursoRepository;
import eetp612.com.ar.asisbiom.stats.Stats;
import eetp612.com.ar.asisbiom.stats.StatsConfigs;
import eetp612.com.ar.asisbiom.stats.StatsRepository;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/estadistica")
public class ConteoController {

    @Autowired
    private ConteoRepository conteoRepository;

    @Autowired
    private AlumnoRepository alumnoRepository;

    @Autowired
    private CursoRepository cursoRepository;

    @Autowired
    private StatsRepository statsRepository;

    @GetMapping("")
    public ResponseEntity<?> findAll() {
        return ResponseEntity.ok().body(conteoRepository.findAll());
    }

    @GetMapping("/cantidades")
    public ResponseEntity<?> getRecuento() {
        return ResponseEntity.ok().body(statsRepository.findById(StatsConfigs.INFO_CANTIDADES).get());
    }

    @GetMapping("/cantidades/diaria")
    public ResponseEntity<?> getRecuentoDiario() {
        return ResponseEntity.ok().body(statsRepository.findById(StatsConfigs.INFO_DIARIA).get());
    }

    @GetMapping("/descarga/{cursoId}")
    public ResponseEntity<?> getFileFromCursoAndDivisionEntity(@PathVariable Integer cursoId) throws IOException {

        File csv = new File("\\home\\joago\\estadistica.csv");

        try (PrintWriter pw = new PrintWriter(csv)) {
            Optional<Curso> curso = cursoRepository.findById(cursoId);

            if (!curso.isPresent()) {
                return ResponseEntity.badRequest().body("Curso no encontrado. ID: " + cursoId);
            }
            pw.write("Curso, Division, Nombre y Apellido, DNI, Dias Hábiles, Inasistencias, Tardanzas, Retiros\n");

            alumnoRepository.findByCurso(curso.get()).forEach(alumno -> {
                List<ConteoAsistencia> found = conteoRepository.findByAlumno(alumno);

                if (!found.isEmpty()) {
                    ConteoAsistencia conteo = found.get(0);

                    pw.write(alumno.getCurso().getCurso() + ", " + alumno.getCurso().getDivision() + ", "
                            + alumno.getNombreCompleto() + ", " + alumno.getDni() + ", " + conteo.getDiasHabiles()
                            + ", " + conteo.getInasistencias() + ", " + conteo.getTardanzas() + ", "
                            + conteo.getRetiros() + "\n");
                }
            });

        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }

        Path path = Paths.get(csv.getAbsolutePath());

        return ResponseEntity.ok().contentType(MediaType.parseMediaType("text/csv"))
                .header("Content-Disposition", "attachment; filename=estadistica.csv").body(Files.readAllBytes(path));
    }

}
