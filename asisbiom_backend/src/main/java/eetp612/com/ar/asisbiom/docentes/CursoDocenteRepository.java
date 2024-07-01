package eetp612.com.ar.asisbiom.docentes;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CursoDocenteRepository extends JpaRepository<CursoDocente, Integer> {
    List<CursoDocente> findByDocente(Docente docente);
}
