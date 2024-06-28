package eetp612.com.ar.asisbiom.cursos;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import eetp612.com.ar.asisbiom.alumnos.Alumno;
import eetp612.com.ar.asisbiom.alumnos.AlumnoRepository;
import eetp612.com.ar.asisbiom.conteoasistencias.ConteoAsistencia;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/api/curso")
public class CursoController {

    @Autowired
    private CursoRepository cursoRepository;

    @Autowired
    private AlumnoRepository alumnoRepository;

    @GetMapping
    public List<Curso> findAll() {
        return cursoRepository.findByOrderByCurso();
    }

    @GetMapping("/{curso}/{division}")
    public ResponseEntity<?> byCursoAndDivision(@PathVariable("curso") int curso,
            @PathVariable("division") char division) {

        List<Curso> found = cursoRepository.findByCursoAndDivisionOrderByCursoAsc(curso, division);
        if (found.isEmpty())
            return ResponseEntity.notFound().build();

        return ResponseEntity.ok().body(found.get(0));
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Curso curso) {

        if (!cursoRepository.findByCursoAndDivisionOrderByCursoAsc(curso.getCurso(), curso.getDivision()).isEmpty())
            return ResponseEntity.badRequest().body("El curso ya existe");

        Curso saved = cursoRepository.save(curso);
        return ResponseEntity.ok().body(saved);
    }

    @RequestMapping("/_initialize")
    public String initDefault() {

        cursoRepository.save(new Curso('A', 1, 2));
        cursoRepository.save(new Curso('B', 1, 2));
        cursoRepository.save(new Curso('C', 1, 2));
        cursoRepository.save(new Curso('D', 1, 2));
        cursoRepository.save(new Curso('E', 1, 2));

        cursoRepository.save(new Curso('A', 2, 2));
        cursoRepository.save(new Curso('B', 2, 2));
        cursoRepository.save(new Curso('C', 2, 2));
        cursoRepository.save(new Curso('D', 2, 2));

        cursoRepository.save(new Curso('A', 3, 1));
        cursoRepository.save(new Curso('B', 3, 1));
        cursoRepository.save(new Curso('C', 3, 2));
        cursoRepository.save(new Curso('D', 3, 2));

        cursoRepository.save(new Curso('A', 4, 1));
        cursoRepository.save(new Curso('B', 4, 1));
        cursoRepository.save(new Curso('C', 4, 2));
        cursoRepository.save(new Curso('D', 4, 2));

        cursoRepository.save(new Curso('A', 5, 1));
        cursoRepository.save(new Curso('B', 5, 1));
        cursoRepository.save(new Curso('C', 5, 2));
        cursoRepository.save(new Curso('D', 5, 2));

        cursoRepository.save(new Curso('A', 6, 1));
        cursoRepository.save(new Curso('B', 6, 2));

        return "ok";
    }

    @GetMapping("/turno")
    public ResponseEntity<List<List<Curso>>> getCursos() {
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

    @DeleteMapping("/remover/{idAlumno}")
    public ResponseEntity<?> removerAlumno(@PathVariable Integer idAlumno) {

        Optional<Alumno> foundAlumno = alumnoRepository.findById(idAlumno);        
        if(foundAlumno.isPresent())
        {   
            Alumno alumno = foundAlumno.get();
            alumno.setCurso(null);

            alumnoRepository.save(alumno);
            
            return ResponseEntity.ok().body(alumno);
        }

        return ResponseEntity.notFound().build();


    }

}
