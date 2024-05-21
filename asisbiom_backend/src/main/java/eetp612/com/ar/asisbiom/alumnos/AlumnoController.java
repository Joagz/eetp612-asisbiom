
/*
 * Autor: Joaquín Gómez 
 * EETP N.612 "Eudocio de los Santos Giménez", Coronda, Santa Fe
 */
package eetp612.com.ar.asisbiom.alumnos;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/alumno")
public class AlumnoController {

    @Autowired
    private AlumnoRepository alumnoRepository;

    @GetMapping
    public List<Alumno> findAll() {
        return alumnoRepository.findAll();
    }
    
    @GetMapping("/{curso}/{div}")
    public List<Alumno> getMethodName(@PathVariable("curso") Integer curso, @PathVariable("div") Character div) {
        return alumnoRepository.findByCursoAndDivision(curso, div);
    }

}
