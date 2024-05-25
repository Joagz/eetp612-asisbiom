
/*
 * Autor: Joaquín Gómez 
 * EETP N.612 "Eudocio de los Santos Giménez", Coronda, Santa Fe
 */
package eetp612.com.ar.asisbiom.horarios;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import eetp612.com.ar.asisbiom.cursos.CursoRepository;
import eetp612.com.ar.asisbiom.general.DateUtils;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/horario")
public class HorarioController {

    @Autowired
    private HorarioRepository horarioRepository;

    @Autowired
    private CursoRepository cursoRepository;

    @GetMapping
    public List<Horario> findAll() {
        return horarioRepository.findAll();
    }

    @GetMapping("/{curso}/{div}")
    public List<Horario> horariosCursoDiv(@PathVariable("curso") Integer curso, @PathVariable("div") Character div) {
        return horarioRepository.findByCurso(cursoRepository.findByCursoAndDivisionOrderByCursoAsc(curso, div).get(0));
    }

    @GetMapping("/hoy")
    public List<Horario> horariosHoy() {
        return horarioRepository.findByDiaOrderByDiaAsc(DateUtils.getDay());
    }

    @GetMapping("/hoy/{curso}/{div}")
    public List<Horario> horariosHoyCursoDiv(@PathVariable("curso") Integer curso, @PathVariable("div") Character div) {
        return horarioRepository.findByCursoAndDiaOrderByDiaAsc(
                cursoRepository.findByCursoAndDivisionOrderByCursoAsc(curso, div).get(0), DateUtils.getDay());
    }

}
