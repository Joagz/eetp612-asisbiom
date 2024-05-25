/*
 * Autor: Joaquín Gómez 
 * EETP N.612 "Eudocio de los Santos Giménez", Coronda, Santa Fe
 */
package eetp612.com.ar.asisbiom.asistencias;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import eetp612.com.ar.asisbiom.alumnos.Alumno;
import eetp612.com.ar.asisbiom.alumnos.AlumnoRepository;
import eetp612.com.ar.asisbiom.cursos.CursoRepository;
import lombok.Data;

@Data
class AlumnoJoinAsistencia {
    Alumno alumno;
    List<Asistencia> asistencias;

    public AlumnoJoinAsistencia(Alumno alumno, List<Asistencia> asistencias) {
        this.alumno = alumno;
        this.asistencias = asistencias;
    }

};

@RestController
@RequestMapping("/api/asistencia")
public class AsistenciaController {

    @Autowired
    private AsistenciaRepository asistenciaRepository;

    @Autowired
    private CursoRepository cursoRepository;

    @Autowired
    private AlumnoRepository alumnoRepository;

    @GetMapping("/{curso}/{div}")
    public List<AlumnoJoinAsistencia> getAsistencias(@PathVariable("curso") Integer curso,
            @PathVariable("div") Character div) {
        List<Alumno> alumnos = alumnoRepository
                .findByCurso(cursoRepository.findByCursoAndDivisionOrderByCursoAsc(curso, div).get(0));
        List<AlumnoJoinAsistencia> listado = new LinkedList<>();

        for (Alumno alumno : alumnos) {
            System.out.println(alumno);
            AlumnoJoinAsistencia alumnoJoinAsistencia = new AlumnoJoinAsistencia(alumno, new ArrayList<>());
            asistenciaRepository.findByAlumnoAndFecha(alumno, LocalDate.now())
                    .forEach(asistencia -> alumnoJoinAsistencia.asistencias.add(asistencia));
            listado.add(alumnoJoinAsistencia);
        }

        return listado;
    }
}
