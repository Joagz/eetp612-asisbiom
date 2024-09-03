package eetp612.com.ar.asisbiom.planillas;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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

    @GetMapping("/{curso}")
    public ResponseEntity<?> getPlanillas(@PathVariable int curso) {
        Optional<Curso> f = cursoRepository.findById(curso);
        if (f.isPresent())
            return ResponseEntity.ok().body(repository.findByCurso(f.get()));

        return ResponseEntity.notFound().build();
    }

    @GetMapping("/descarga/{curso}/{mes}")
    public ResponseEntity<?> getPlanillaDownload(@PathVariable int curso, @PathVariable int mes) {
        Planilla planilla = service.nuevaPlanillaMensual(Mes.values()[mes - 1], curso);
        String path = planilla.getFileNameFull();

        Path filePath = Paths.get(path);
        File file = filePath.toFile();
        Optional<Curso> f = cursoRepository.findById(curso);
        if(f.isEmpty())
        {
            return ResponseEntity.notFound().build();
        }
        planilla.setMes(Mes.values()[mes-1]);
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
