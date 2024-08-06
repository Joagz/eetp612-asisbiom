package eetp612.com.ar.asisbiom.retiro;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import eetp612.com.ar.asisbiom.alumnos.Alumno;

public interface RetiroRepository extends JpaRepository<Retiro, Integer> {
    List<Retiro> findByAlumno(Alumno alumno);
}
