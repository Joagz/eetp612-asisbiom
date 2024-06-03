
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

    @Column(name = "tardanzas")
    private Integer tardanzas;

    @Column(name = "retiros")
    private Integer retiros;

    @Column(name = "dias_habiles")
    private Long diasHabiles;

    @Column(name = "inasistencias_1")
    private Float inasistencias1;

    @Column(name = "inasistencias_2")
    private Float inasistencias2;

    @Column(name = "inasistencias_3")
    private Float inasistencias3;

    

    public ConteoAsistencia(Alumno alumno) {
        this.alumno = alumno;
        this.tardanzas = 0;
        this.retiros = 0;
        this.diasHabiles = 0l;
        this.inasistencias1 = 0f;
        this.inasistencias2 = 0f;
        this.inasistencias3 = 0f;
    }



    public ConteoAsistencia() {
    }

}
