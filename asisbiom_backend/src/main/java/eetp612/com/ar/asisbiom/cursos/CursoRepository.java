package eetp612.com.ar.asisbiom.cursos;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;


public interface CursoRepository extends JpaRepository<Curso, Integer> {
    List<Curso> findByCurso(Integer curso);
    List<Curso> findByDivision(Character division);
    List<Curso> findByCursoAndDivisionOrderByCursoAsc(Integer curso, Character division);
    List<Curso> findByTurno(Integer turno);
}
