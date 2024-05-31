package eetp612.com.ar.asisbiom.cursos;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/curso")
public class CursoController {

    @Autowired
    private CursoRepository cursoRepository;

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Curso curso) {
        Curso saved = cursoRepository.save(curso);
        return ResponseEntity.ok().body(saved);
    }

    @GetMapping("/turno")
    public ResponseEntity<List<List<Curso>>> getMethodName() {
        List<Curso> manana = new ArrayList<>();
        List<Curso> tarde = new ArrayList<>();

        cursoRepository.findAll().forEach(
                curso -> {
                    if (curso.getTurno() == 1)
                        manana.add(curso);
                    else
                        tarde.add(curso);
                });

        List<List<Curso>> cursos = new ArrayList<>();
        cursos.add(manana);
        cursos.add(tarde);

        return ResponseEntity.ok().body(cursos);
    }

}
