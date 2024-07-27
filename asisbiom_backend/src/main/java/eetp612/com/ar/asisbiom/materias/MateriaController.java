package eetp612.com.ar.asisbiom.materias;

import org.springframework.web.bind.annotation.RestController;

import eetp612.com.ar.asisbiom.cursos.Curso;
import eetp612.com.ar.asisbiom.cursos.CursoRepository;
import eetp612.com.ar.asisbiom.general.DateUtils;
import eetp612.com.ar.asisbiom.general.Dia;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/materia")
public class MateriaController {

    @Autowired
    private MateriaRepository materiaRepository;

    @Autowired
    private CursoRepository cursoRepository;

    @Autowired
    private MateriaCursoRespository materiaCursoRespository;

    // TODO: fetch materias y horarios asociados a un día y curso
    @GetMapping("/{id_curso}")
    public ResponseEntity<?> findbyId(@PathVariable("id_curso") int id) {
        Dia today = DateUtils.getDay();
        Optional<Curso> foundCurso = cursoRepository.findById(id);
        if (foundCurso.isPresent()) {
            Curso curso = foundCurso.get();
            List<MateriaCurso> materias = materiaCursoRespository.findByCurso(curso);
            List<MateriaCurso> foundMaterias = materias.stream().filter(m -> m.getDia().equals(today))
                    .collect(Collectors.toList());
            foundMaterias.sort((m1, m2) -> m1.getHoraInicio() - m2.getHoraInicio());
            if (!foundMaterias.isEmpty()) {

                return ResponseEntity.ok().body(foundMaterias);
            }
        }

        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Materia materia) {
        return ResponseEntity.ok().body(materiaRepository.save(materia));
    }

}
