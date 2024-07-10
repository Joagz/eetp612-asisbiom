
/*
 * Autor: Joaquín Gómez 
 * EETP N.612 "Eudocio de los Santos Giménez", Coronda, Santa Fe
 */
package eetp612.com.ar.asisbiom.notas;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import eetp612.com.ar.asisbiom.alumnos.Alumno;
import eetp612.com.ar.asisbiom.alumnos.AlumnoRepository;

@RestController
@RequestMapping("/api/nota")
public class NotaController {

    @Autowired
    private NotaRepository notaRepository;

    @Autowired
    private AlumnoRepository alumnoRepository;

    @GetMapping
    public List<Nota> findAll() {
        return notaRepository.findAll();
    }

    @PostMapping("/{id_alumno}")
    private ResponseEntity<?> newNote(@PathVariable("id_alumno") int id_alumno, @RequestBody NotaDto dto) {

        Optional<Alumno> found = alumnoRepository.findById(id_alumno);

        if (!found.isPresent())
            return ResponseEntity.notFound().build();

        Nota nota = NotaMapper.map(dto, found.get());

        return ResponseEntity.ok().body(notaRepository.save(nota));
    }

}
