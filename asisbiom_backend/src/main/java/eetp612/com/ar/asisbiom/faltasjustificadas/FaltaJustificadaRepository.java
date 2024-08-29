package eetp612.com.ar.asisbiom.faltasjustificadas;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import eetp612.com.ar.asisbiom.alumnos.Alumno;

public interface FaltaJustificadaRepository extends JpaRepository<FaltaJustificada, Integer> {
    List<FaltaJustificada> findByAlumno(Alumno alumno);

    List<FaltaJustificada> findByAlumnoAndFecha(Alumno alumno, LocalDate fecha);
}
