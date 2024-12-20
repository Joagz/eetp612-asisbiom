
/*
 * Autor: Joaquín Gómez 
 * EETP N.612 "Eudocio de los Santos Giménez", Coronda, Santa Fe
 */
package eetp612.com.ar.asisbiom.horarios;

import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import eetp612.com.ar.asisbiom.cursos.Curso;
import eetp612.com.ar.asisbiom.general.Dia;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Table(name = "horarios")
public class Horario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_curso")
    private Curso curso;

    @JsonFormat(pattern = "HH:mm:ss")
    @Column(name = "horario_entrada")
    private LocalTime horarioEntrada;

    @JsonFormat(pattern = "HH:mm:ss")
    @Column(name = "horario_salida")
    private LocalTime horarioSalida;
    
    @Column(name = "clase")
    private String clase;

    @Column(name = "dia")
    @Enumerated(EnumType.ORDINAL)
    private Dia dia;
    
    @Column(name = "valor_inasistencia")
    private float valorInasistencia;

}
