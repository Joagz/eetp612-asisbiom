
/*
 * Autor: Joaquín Gómez 
 * EETP N.612 "Eudocio de los Santos Giménez", Coronda, Santa Fe
 */
package eetp612.com.ar.asisbiom.conteoasistencias;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ConteoRepository extends JpaRepository<ConteoAsistencia, Integer> {

}
