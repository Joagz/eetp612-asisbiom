package eetp612.com.ar.asisbiom.materias;

import org.springframework.web.bind.annotation.RestController;

import eetp612.com.ar.asisbiom.cursos.Curso;
import eetp612.com.ar.asisbiom.cursos.CursoRepository;
import eetp612.com.ar.asisbiom.docentes.Docente;
import eetp612.com.ar.asisbiom.docentes.DocenteRepository;
import eetp612.com.ar.asisbiom.general.Dia;
import eetp612.com.ar.asisbiom.general.Hora;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/materia")
public class MateriaController {

    @Autowired
    private MateriaRepository materiaRepository;

    @Autowired
    private DocenteRepository docenteRepository;

    @Autowired
    private CursoRepository cursoRepository;

    @GetMapping
    public ResponseEntity<?> find(
            @RequestParam(required = false, name = "id_docente", defaultValue = "") Integer idDocente,
            @RequestParam(required = false, name = "id_curso", defaultValue = "") Integer idCurso,
            @RequestParam(required = false, name = "dia", defaultValue = "") Dia dia) {

        List<Materia> materias = new ArrayList<>();

        // Solo ID_DOCENTE
        if (idCurso == null && idDocente != null && dia == null) {

            Optional<Docente> found = docenteRepository.findById(idDocente);

            if (found.isPresent())
                materias = (materiaRepository.findByDocente(found.get()));
        }

        // solo ID_CURSO
        else if (idCurso != null && idDocente == null && dia == null) {
            Optional<Curso> found = cursoRepository.findById(idCurso);

            if (found.isPresent())
                materias = (materiaRepository.findByCurso(found.get()));
        }

        // solo ID_CURSO e ID_DOCENTE
        else if (idCurso != null && idDocente != null && dia == null) {
            Optional<Curso> foundCurso = cursoRepository.findById(idCurso);
            Optional<Docente> foundDocente = docenteRepository.findById(idDocente);

            if (foundCurso.isPresent() && foundDocente.isPresent())
                materias = (materiaRepository.findByCursoAndDocente(foundCurso.get(), foundDocente.get()));
        }

        // solo DIA e ID_CURSO
        else if (dia != null && idCurso != null && idDocente == null) {

            Optional<Curso> foundCurso = cursoRepository.findById(idCurso);

            if (foundCurso.isPresent())
                materias = (materiaRepository.findByCursoAndDia(foundCurso.get(), dia));
            else
                System.out.println("Not found");

        }

        // solo DIA e ID_DOCENTE
        else if (dia != null && idCurso == null && idDocente != null) {

            Optional<Docente> foundDocente = docenteRepository.findById(idDocente);

            if (foundDocente.isPresent())
                materias = (materiaRepository.findByDocenteAndDia(foundDocente.get(), dia));
            else
                System.out.println("Not found");

        }

        else if (dia != null && idCurso != null && idDocente != null) {

            Optional<Curso> foundCurso = cursoRepository.findById(idCurso);
            Optional<Docente> foundDocente = docenteRepository.findById(idDocente);

            if (foundCurso.isPresent() && foundDocente.isPresent())
                materias = (materiaRepository.findByCursoAndDiaAndDocente(foundCurso.get(), dia, foundDocente.get()));
            else
                System.out.println("Not found");
        } else
            materias = materiaRepository.findAll();

        return ResponseEntity.ok().body(
                materias);

    }

}
