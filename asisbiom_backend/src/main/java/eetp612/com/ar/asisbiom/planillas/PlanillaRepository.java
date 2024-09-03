package eetp612.com.ar.asisbiom.planillas;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import eetp612.com.ar.asisbiom.cursos.Curso;

public interface PlanillaRepository extends JpaRepository<Planilla, Integer> {
    List<Planilla> findByCurso(Curso curso);
}
