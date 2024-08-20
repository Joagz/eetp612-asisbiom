package eetp612.com.ar.asisbiom.retiro;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import eetp612.com.ar.asisbiom.alumnos.Alumno;
import eetp612.com.ar.asisbiom.alumnos.AlumnoRepository;
import eetp612.com.ar.asisbiom.user.User;
import eetp612.com.ar.asisbiom.user.UserRepository;
import io.swagger.v3.oas.annotations.parameters.RequestBody;

@RestController
@RequestMapping("/api/retiro")
public class RetiroController {

    @Autowired
    private RetiroRepository repository;

    @Autowired
    private AlumnoRepository alumnoRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    List<Retiro> findAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    ResponseEntity<List<Retiro>> findAllByAlumno(@PathVariable("id") int id) {
        Optional<Alumno> found = alumnoRepository.findById(id);

        if (!found.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok().body(repository.findByAlumno(found.get()));
    }

    @PostMapping("/{idAlumno}/{idProfesor}/{razon}")
    ResponseEntity<?> create(@PathVariable("razon") String razon, @PathVariable("idAlumno") int idAlumno, @PathVariable("idProfesor") int idProfesor) {

        Optional<Alumno> foundAlumno = alumnoRepository.findById(idAlumno);
        Optional<User> foundProfesor = userRepository.findById(idProfesor);
     
        Retiro retiro = new Retiro();

        if (foundAlumno.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        if (foundProfesor.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        retiro.setProfesor(foundProfesor.get());
        retiro.setFecha(LocalDate.now());
        retiro.setAlumno(foundAlumno.get());
        retiro.setRazon(razon);

        return ResponseEntity.ok().body(repository.save(retiro));
    }

    @PutMapping("/editar/{id}")
    ResponseEntity<?> edit(@RequestParam("razon") String razon, @PathVariable("id") int id) {
        Optional<Retiro> found = repository.findById(id);

        if (!found.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Retiro retiro = found.get();

        retiro.setRazon(razon);

        return ResponseEntity.ok().body(repository.save(retiro));
    }

}
