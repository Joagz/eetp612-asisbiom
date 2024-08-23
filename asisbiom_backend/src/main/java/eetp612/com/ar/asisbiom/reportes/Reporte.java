package eetp612.com.ar.asisbiom.reportes;

import java.time.LocalDate;

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
@Table(name = "reportes")
public class Reporte {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(name = "nombre_completo")
    private String nombreCompleto;
    private String telefono;
    private String email;
    private String titulo;
    private String situacion;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate fecha;
}
