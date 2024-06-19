package eetp612.com.ar.asisbiom.materias;

import java.util.List;

import eetp612.com.ar.asisbiom.cursos.Curso;
import eetp612.com.ar.asisbiom.docentes.Docente;
import eetp612.com.ar.asisbiom.general.Dia;
import eetp612.com.ar.asisbiom.general.Hora;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
@Entity
@Table(name = "materias")
public class Materia {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @JoinColumn(name = "id_docente")
    @ManyToOne
    private Docente docente;

    @JoinColumn(name = "id_curso")
    @ManyToOne
    private Curso curso;

    private String nombre;

    private Dia dia;

    @OneToMany(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_materia")
    private List<HorarioMateria> horario;

}
