
/*
 * Autor: Joaquín Gómez 
 * EETP N.612 "Eudocio de los Santos Giménez", Coronda, Santa Fe
 */
package eetp612.com.ar.asisbiom.horarios;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import eetp612.com.ar.asisbiom.cursos.Curso;

@Repository
public interface HorarioRepository extends JpaRepository<Horario, Integer> {
    List<Horario> findByCurso(Curso curso);

    List<Horario> findByCursoAndDiaOrderByDiaAsc(Curso curso, int dia);

    List<Horario> findByDiaOrderByDiaAsc(int dia);

}
