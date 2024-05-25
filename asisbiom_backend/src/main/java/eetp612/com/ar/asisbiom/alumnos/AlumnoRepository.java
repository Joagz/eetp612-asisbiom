
/*
 * Autor: Joaquín Gómez 
 * EETP N.612 "Eudocio de los Santos Giménez", Coronda, Santa Fe
 */
package eetp612.com.ar.asisbiom.alumnos;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import eetp612.com.ar.asisbiom.cursos.Curso;

@Repository
public interface AlumnoRepository extends JpaRepository<Alumno, Integer> {

    List<Alumno> findByCurso(Curso curso);

    List<Alumno> findByDni(String dni);

    List<Alumno> findByNombreCompleto(String nombreCompleto);

}
