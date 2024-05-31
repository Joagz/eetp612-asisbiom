
/*
 * Autor: Joaquín Gómez 
 * EETP N.612 "Eudocio de los Santos Giménez", Coronda, Santa Fe
 */
package eetp612.com.ar.asisbiom.conteoasistencias;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import eetp612.com.ar.asisbiom.alumnos.Alumno;


@Repository
public interface ConteoRepository extends JpaRepository<ConteoAsistencia, Integer> {
    List<ConteoAsistencia> findByAlumno(Alumno alumno);
    List<ConteoAsistencia> findByAlumnoAndTrimestre(Alumno alumno, Integer trimestre);
}
