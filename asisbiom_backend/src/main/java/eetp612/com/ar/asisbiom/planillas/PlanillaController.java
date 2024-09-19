package eetp612.com.ar.asisbiom.planillas;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import eetp612.com.ar.asisbiom.cursos.Curso;
import eetp612.com.ar.asisbiom.cursos.CursoRepository;
import eetp612.com.ar.asisbiom.general.Mes;

@RestController
@RequestMapping("/api/planilla")
public class PlanillaController {

    @Autowired
    private PlanillaService service;

    @Autowired
    private PlanillaRepository repository;
    @Autowired
    private CursoRepository cursoRepository;

    @GetMapping("/curso/{curso}")
    public ResponseEntity<?> getPlanillasByCurso(@PathVariable int curso) {
        Optional<Curso> f = cursoRepository.findById(curso);
        if (f.isPresent()) {
            return ResponseEntity.ok().body(repository.findByCurso(f.get()));
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPlanillas(@PathVariable int id) {

        Optional<Planilla> found = repository.findById(id);

        if (found.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok().body(found.get());
    }

    @PostMapping("/generar/{curso}")
    public ResponseEntity<?> generarPlanillas(@PathVariable int curso) {
        int mes = 1;
        List<Planilla> planillas = new ArrayList<>();
        Optional<Curso> f = cursoRepository.findById(curso);
        if (f.isEmpty()) {
            return ResponseEntity.badRequest().body("Id del curso inválido");
        }

        int currentYear = LocalDate.now().getYear();
        for (Planilla byCurso : repository.findByCurso(f.get())) {
            if (byCurso.getFecha().getYear() == currentYear) {
                repository.delete(byCurso);
            }
        }

        while (mes <= 12 && LocalDate.now().getMonthValue() > mes) {
            Planilla planilla = service.nuevaPlanillaMensual(Mes.values()[mes - 1], curso);

            if (planilla == null) {
                break;
            }

            planilla.setMes(Mes.values()[mes - 1]);
            planilla.setCurso(f.get());

            planillas.add(repository.save(planilla));
            mes++;
        }

        return ResponseEntity.ok().body(planillas);
    }

    @GetMapping("/descarga/{id}")
    public ResponseEntity<?> getPlanillaDownload(@PathVariable int id) {
        Optional<Planilla> found = repository.findById(id);

        if (found.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Planilla planilla = found.get();

        Path filePath = Paths.get(planilla.getFileNameFull());
        File file = filePath.toFile();

        try (FileInputStream inputStream = new FileInputStream(file)) {
            byte[] data = inputStream.readNBytes(((int) file.length()));
            return ResponseEntity.ok().contentType(MediaType.APPLICATION_OCTET_STREAM).contentLength(file.length())
                    .header("Content-Disposition", "attachment; filename=" + planilla.getFileName()).body(data);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("No se pudo inicializar el archivo...");
        }

    }

    @GetMapping("/descarga/{curso}/{mes}")
    public ResponseEntity<?> getPlanillaDownload(@PathVariable int curso, @PathVariable int mes) {
        Planilla planilla = service.nuevaPlanillaMensual(Mes.values()[mes - 1], curso);
        String path = planilla.getFileNameFull();

        Path filePath = Paths.get(path);
        File file = filePath.toFile();
        Optional<Curso> f = cursoRepository.findById(curso);
        if (f.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        planilla.setMes(Mes.values()[mes - 1]);
        planilla.setCurso(f.get());

        repository.save(planilla);

        try (FileInputStream inputStream = new FileInputStream(file)) {
            byte[] data = inputStream.readNBytes(((int) file.length()));
            return ResponseEntity.ok().contentType(MediaType.APPLICATION_OCTET_STREAM).contentLength(file.length())
                    .header("Content-Disposition", "attachment; filename=" + planilla.getFileName()).body(data);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("No se pudo inicializar el archivo...");
        }

    }
}
