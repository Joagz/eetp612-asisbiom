
/*
 * Autor: Joaquín Gómez 
 * EETP N.612 "Eudocio de los Santos Giménez", Coronda, Santa Fe
 */
package eetp612.com.ar.asisbiom.horarios;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import eetp612.com.ar.asisbiom.cursos.CursoRepository;
import eetp612.com.ar.asisbiom.general.DateUtils;
import eetp612.com.ar.asisbiom.general.Dia;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

/**
 * HorarioDto
 */
record HorarioDto(
        int curso, LocalTime horarioEntrada,
        LocalTime horarioSalida, String clase, int dia, float valorInasistencia) {
}

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
    public List<Horario> horariosCursoDiv(@PathVariable("curso") Integer curso,
            @PathVariable("div") Character div) {
        return horarioRepository
                .findByCurso(cursoRepository.findByCursoAndDivisionOrderByCursoAsc(curso, div).get(0));
    }

    @GetMapping("/hoy")
    public List<Horario> horariosHoy() {
        return horarioRepository.findByDiaOrderByDiaAsc(DateUtils.getDay());
    }

    @GetMapping("/hoy/{curso}/{div}")
    public List<Horario> horariosHoyCursoDiv(@PathVariable("curso") Integer curso,
            @PathVariable("div") Character div) {
        return horarioRepository.findByCursoAndDiaOrderByDiaAsc(
                cursoRepository.findByCursoAndDivisionOrderByCursoAsc(curso, div).get(0), DateUtils.getDay());
    }

    @PostMapping
    public ResponseEntity<?> addHorario(@RequestBody HorarioDto horario) {

        if (cursoRepository.findByCurso(horario.curso()).isEmpty())
            return ResponseEntity.notFound().build();

        Horario newHorario = new Horario();
        newHorario.setClase(horario.clase());
        newHorario.setDia(Dia.values()[horario.dia()]);
        newHorario.setHorarioEntrada(horario.horarioEntrada());
        newHorario.setHorarioSalida(horario.horarioSalida());
        newHorario.setValorInasistencia(horario.valorInasistencia());

        return ResponseEntity.ok().body(horarioRepository.save(newHorario));
    }

    @PostMapping("/all")
    public ResponseEntity<?> addHorarios(@RequestBody List<HorarioDto> horarios) {
        List<Horario> newHorarios = new ArrayList<>();

        for (HorarioDto horario : horarios) {
            if (cursoRepository.findById(horario.curso()).isEmpty())
                continue;

            Horario newHorario = new Horario();
            newHorario.setClase(horario.clase());
            newHorario.setCurso(cursoRepository.findById(horario.curso()).get());
            newHorario.setDia(Dia.values()[horario.dia()]);
            newHorario.setHorarioEntrada(horario.horarioEntrada());
            newHorario.setHorarioSalida(horario.horarioSalida());
            newHorario.setValorInasistencia(horario.valorInasistencia());
            newHorarios.add(horarioRepository.save(newHorario));
        }

        return ResponseEntity.ok().body(horarios);
    }

}
