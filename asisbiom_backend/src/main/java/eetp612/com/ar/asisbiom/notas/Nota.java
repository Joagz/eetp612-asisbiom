

/*
 * Autor: Joaquín Gómez 
 * EETP N.612 "Eudocio de los Santos Giménez", Coronda, Santa Fe
 */
package eetp612.com.ar.asisbiom.notas;

import java.util.Date;

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
@Table(name = "notas")
public class Nota {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "alumno_id", table = "alumnos")
    private Alumno alumno;

    @Column(name = "nivel_urgencia")
    private Integer nivel_urgencia;

    @Column(name = "asunto")
    private String asunto;

    @Column(name = "fecha")
    private Date fecha;

    @Column(name = "vencimiento")
    private Date vencimiento;

    @Column(name = "contenido")
    private String contenido;

}
