
/*
 * Autor: Joaquín Gómez 
 * EETP N.612 "Eudocio de los Santos Giménez", Coronda, Santa Fe
 */
package eetp612.com.ar.asisbiom.asistencias;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import eetp612.com.ar.asisbiom.alumnos.Alumno;
import eetp612.com.ar.asisbiom.general.Dia;

@Repository
public interface AsistenciaRepository extends JpaRepository<Asistencia, Integer> {
    List<Asistencia> findByAlumno(Alumno alumno);
    List<Asistencia> findByAlumnoAndDia(Alumno alumno, Dia dia);
    List<Asistencia> findByAlumnoAndFecha(Alumno alumno, LocalDate fecha);
}
