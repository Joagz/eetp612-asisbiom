
/*
 * Autor: Joaquín Gómez 
 * EETP N.612 "Eudocio de los Santos Giménez", Coronda, Santa Fe
 */
package eetp612.com.ar.asisbiom.horarios;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface HorarioRepository extends JpaRepository<Horario, Integer> {
    List<Horario> findByCurso(char curso);

    List<Horario> findByCursoAndDivisionAndDiaOrderByDiaAsc(Integer curso, char division, int dia);

    List<Horario> findByDiaOrderByDiaAsc(int dia);

}
