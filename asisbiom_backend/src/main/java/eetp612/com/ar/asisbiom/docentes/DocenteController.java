
/*
 * Autor: Joaquín Gómez 
 * EETP N.612 "Eudocio de los Santos Giménez", Coronda, Santa Fe
 */
package eetp612.com.ar.asisbiom.docentes;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import eetp612.com.ar.asisbiom.user.RoleRepository;
import eetp612.com.ar.asisbiom.user.UserRepository;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/docente")
public class DocenteController {

    @Autowired
    private DocenteRepository docenteRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @ExceptionHandler(value = { Exception.class })
    public ResponseEntity<?> catchAll() {
        return ResponseEntity.internalServerError().body("Ocurrió un error al procesar la solicitud. Lo sentimos.");
    }

    @GetMapping
    public List<Docente> findAll() {
        return docenteRepository.findAll();
    }

    @GetMapping("/cargos/{cargo}")
    public List<Docente> getByCargo(@PathVariable("cargo") CargoDocente cargo) {
        return userRepository.findByRole(roleRepository.findByRole(cargo).get(0)).stream()
                .map(user -> user.getDocente()).toList();
    }

    @GetMapping("/search")
    public ResponseEntity<?> getByIdOrDniOrNombreCompleto(
            @RequestParam(name = "id", required = false) Integer id,
            @RequestParam(name = "dni", required = false) String dni,
            @RequestParam(name = "nombre_completo", required = false) String nombre_completo) {

        if (id != null) {
            Optional<Docente> found = docenteRepository.findById(id);

            if (found.isPresent())
                return new ResponseEntity<>(found.get(), HttpStatus.OK);
        } else if (dni != null) {
            List<Docente> found = docenteRepository.findByDni(dni);

            if (!found.isEmpty())
                return new ResponseEntity<>(found.get(0), HttpStatus.OK);

        } else {
            List<Docente> found = docenteRepository.findByNombreCompleto(nombre_completo);

            if (!found.isEmpty())
                return new ResponseEntity<>(found.get(0), HttpStatus.OK);
        }

        return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);

    }

}
