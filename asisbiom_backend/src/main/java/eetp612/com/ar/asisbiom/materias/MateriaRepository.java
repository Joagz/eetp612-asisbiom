package eetp612.com.ar.asisbiom.materias;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import eetp612.com.ar.asisbiom.general.Dia;
import eetp612.com.ar.asisbiom.user.User;
import eetp612.com.ar.asisbiom.cursos.Curso;

public interface MateriaRepository extends JpaRepository<Materia, Integer> {

    List<Materia> findByUsuario(User usuario);

    List<Materia> findByCurso(Curso curso);

    List<Materia> findByCursoAndDia(Curso curso, Dia dia);

    List<Materia> findByUsuarioAndDia(User usuario, Dia dia);

    List<Materia> findByCursoAndUsuario(Curso curso, User usuario);

    List<Materia> findByCursoAndDiaAndUsuario(Curso curso, Dia dia, User usuario);

}
