package eetp612.com.ar.asisbiom.cursos;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


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
    

}
