package eetp612.com.ar.asisbiom.retiro;

import java.time.LocalTime;
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

    @PostMapping
    ResponseEntity<?> create(@RequestBody RetiroDto dto) {

        Optional<Alumno> foundAlumno = alumnoRepository.findById(dto.alumno());
        Optional<User> foundProfesor = userRepository.findById(dto.profesor());
        Retiro retiro = new Retiro();

        if (!foundAlumno.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        if(foundProfesor.isPresent())
        {
            retiro.setProfesor(foundProfesor.get()); 
        }

        retiro.setFecha(LocalTime.now());
        retiro.setAlumno(foundAlumno.get());
        retiro.setRazon(dto.razon());

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
