package eetp612.com.ar.asisbiom.materias;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import eetp612.com.ar.asisbiom.docentes.Docente;
import eetp612.com.ar.asisbiom.general.Dia;
import eetp612.com.ar.asisbiom.cursos.Curso;

public interface MateriaRepository extends JpaRepository<Materia, Integer> {

    List<Materia> findByDocente(Docente docente);

    List<Materia> findByCurso(Curso curso);

    List<Materia> findByCursoAndDia(Curso curso, Dia dia);

    List<Materia> findByDocenteAndDia(Docente docente, Dia dia);

    List<Materia> findByCursoAndDocente(Curso curso, Docente docente);

    List<Materia> findByCursoAndDiaAndDocente(Curso curso, Dia dia, Docente docente);

}
