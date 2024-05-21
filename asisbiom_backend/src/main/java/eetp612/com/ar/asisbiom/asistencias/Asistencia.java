
/*
 * Autor: Joaquín Gómez 
 * EETP N.612 "Eudocio de los Santos Giménez", Coronda, Santa Fe
 */
package eetp612.com.ar.asisbiom.asistencias;

import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalTime;
import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

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
    @JoinColumn(name = "alumno_id")
    private Alumno alumno;

    @JsonFormat(pattern = "HH:mm:ss")
    @Column(name = "horario_entrada")
    private LocalTime horarioEntrada;

    @JsonFormat(pattern = "HH:mm:ss")
    @Column(name = "horario_salida")
    private LocalTime horarioSalida;

    @JsonFormat(pattern = "yyyy-MM-dd")
    @Column(name = "fecha")
    private String fecha;

    @Column(name = "tardanza")
    private Boolean tardanza;

    @Column(name = "retirado")
    private Boolean retirado;

    @Column(name = "razon_retiro")
    private String razonRetiro;

    @Column(name = "dia")
    private int dia;

}
