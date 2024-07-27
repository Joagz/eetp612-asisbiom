package eetp612.com.ar.asisbiom.materias;

import eetp612.com.ar.asisbiom.cursos.Curso;
import eetp612.com.ar.asisbiom.general.Dia;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
@Entity
@Table(name = "materia_curso")
public class MateriaCurso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "hora_inicio")
    private Integer horaInicio;

    @Column(name = "hora_fin")
    private Integer horaFin;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_materia")
    private Materia materia;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_curso")
    private Curso curso;

    private Dia dia;

}
