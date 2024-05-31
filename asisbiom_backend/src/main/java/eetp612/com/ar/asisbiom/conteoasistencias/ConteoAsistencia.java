
/*
 * Autor: Joaquín Gómez 
 * EETP N.612 "Eudocio de los Santos Giménez", Coronda, Santa Fe
 */
package eetp612.com.ar.asisbiom.conteoasistencias;

import eetp612.com.ar.asisbiom.alumnos.Alumno;
import jakarta.persistence.CascadeType;
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
@Table(name = "conteo_asistencia")
public class ConteoAsistencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "alumno_id")
    private Alumno alumno;

    @Column(name = "inasistencias")
    private Float inasistencias;

    @Column(name = "tardanzas")
    private Integer tardanzas;

    @Column(name = "retiros")
    private Integer retiros;

    @Column(name = "dias_habiles")
    private Long diasHabiles;

    @Column(name = "trimestre")
    private Integer trimestre;

    public ConteoAsistencia(Alumno alumno, Integer trimestre) {
        this.alumno = alumno;
        this.inasistencias = 0f;
        this.retiros = 0;
        this.tardanzas = 0;
        this.diasHabiles = 0l;
        this.trimestre = trimestre;
    }

    public ConteoAsistencia() {
    }

}
