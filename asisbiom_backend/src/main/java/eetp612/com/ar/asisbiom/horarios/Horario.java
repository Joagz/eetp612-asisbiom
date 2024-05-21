
/*
 * Autor: Joaquín Gómez 
 * EETP N.612 "Eudocio de los Santos Giménez", Coronda, Santa Fe
 */
package eetp612.com.ar.asisbiom.horarios;

import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonFormat;

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
@Table(name = "horarios")
public class Horario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "curso")
    private Integer curso;

    @Column(name = "division")
    private Character division;

    @JsonFormat(pattern = "HH:mm:ss")
    @Column(name = "horario_entrada")
    private LocalTime horarioEntrada;

    @JsonFormat(pattern = "HH:mm:ss")
    @Column(name = "horario_salida")
    private LocalTime horarioSalida;

    @Column(name = "clase")
    private Integer clase;

    @Column(name = "dia")
    private Integer dia;

    @Column(name = "turno")
    private Integer turno;

}
