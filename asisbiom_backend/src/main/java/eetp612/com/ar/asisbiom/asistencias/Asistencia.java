
/*
 * Autor: Joaquín Gómez 
 * EETP N.612 "Eudocio de los Santos Giménez", Coronda, Santa Fe
 */
package eetp612.com.ar.asisbiom.asistencias;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

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
@Table(name = "asistencias")
public class Asistencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "alumno_id", table = "alumnos")
    private Alumno alumno;

    @JsonFormat(pattern = "HH:mm:ss")
    @Column(name = "horario_entrada")
    private LocalDate horarioEntrada;

    @JsonFormat(pattern = "HH:mm:ss")
    @Column(name = "horario_salida")
    private LocalDate horarioSalida;

    @Column(name = "fecha")
    private Date fecha = Date.from(Instant.now());

    @Column(name = "tardanza")
    private Boolean tardanza;

    @Column(name = "retirado")
    private Boolean retirado;

    @Column(name = "razon_retiro")
    private String razonRetiro;

}
