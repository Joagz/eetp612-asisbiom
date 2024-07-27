package eetp612.com.ar.asisbiom.materias;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import eetp612.com.ar.asisbiom.cursos.Curso;

public interface MateriaCursoRespository extends JpaRepository<MateriaCurso, Integer> {
    List<MateriaCurso> findByMateria(Materia materia);   
    List<MateriaCurso> findByCurso(Curso curso); 
}
