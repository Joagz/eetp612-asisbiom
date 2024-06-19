package eetp612.com.ar.asisbiom.materias;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
@Entity
@Table(name = "horario_materia")
public class HorarioMateria {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "hora_inicio")
    private Integer horaInicio;

    @Column(name = "hora_fin")
    private Integer horaFin;

    private Integer id_materia;


}
