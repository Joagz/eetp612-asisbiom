package eetp612.com.ar.asisbiom.materias;

import org.springframework.web.bind.annotation.RestController;

import eetp612.com.ar.asisbiom.cursos.Curso;
import eetp612.com.ar.asisbiom.cursos.CursoRepository;
import eetp612.com.ar.asisbiom.general.Dia;
import eetp612.com.ar.asisbiom.user.User;
import eetp612.com.ar.asisbiom.user.UserRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<?> find(
            @RequestParam(required = false, name = "id_user", defaultValue = "") Integer idUser,
            @RequestParam(required = false, name = "id_curso", defaultValue = "") Integer idCurso,
            @RequestParam(required = false, name = "dia", defaultValue = "") Dia dia) {

        List<Materia> materias = new ArrayList<>();

        // Solo ID_USER
        if (idCurso == null && idUser != null && dia == null) {

            Optional<User> found = userRepository.findById(idUser);

            if (found.isPresent())
                materias = (materiaRepository.findByUsuario(found.get()));
        }

        // solo ID_CURSO
        else if (idCurso != null && idUser == null && dia == null) {
            Optional<Curso> found = cursoRepository.findById(idCurso);

            if (found.isPresent())
                materias = (materiaRepository.findByCurso(found.get()));
        }

        // solo ID_CURSO e ID_USER
        else if (idCurso != null && idUser != null && dia == null) {
            Optional<Curso> foundCurso = cursoRepository.findById(idCurso);
            Optional<User> foundUser = userRepository.findById(idUser);

            if (foundCurso.isPresent() && foundUser.isPresent())
                materias = (materiaRepository.findByCursoAndUsuario(foundCurso.get(), foundUser.get()));
        }

        // solo DIA e ID_CURSO
        else if (dia != null && idCurso != null && idUser == null) {

            Optional<Curso> foundCurso = cursoRepository.findById(idCurso);

            if (foundCurso.isPresent())
                materias = (materiaRepository.findByCursoAndDia(foundCurso.get(), dia));
            else
                System.out.println("Not found");

        }

        // solo DIA e ID_USER
        else if (dia != null && idCurso == null && idUser != null) {

            Optional<User> foundUser = userRepository.findById(idUser);

            if (foundUser.isPresent())
                materias = (materiaRepository.findByUsuarioAndDia(foundUser.get(), dia));
            else
                System.out.println("Not found");

        }

        else if (dia != null && idCurso != null && idUser != null) {

            Optional<Curso> foundCurso = cursoRepository.findById(idCurso);
            Optional<User> foundUser = userRepository.findById(idUser);

            if (foundCurso.isPresent() && foundUser.isPresent())
                materias = (materiaRepository.findByCursoAndDiaAndUsuario(foundCurso.get(), dia, foundUser.get()));
            else
                System.out.println("Not found");
        } else
            materias = materiaRepository.findAll();

        return ResponseEntity.ok().body(
                materias);

    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Materia materia) {
        return ResponseEntity.ok().body(materiaRepository.save(materia));
    }

}
