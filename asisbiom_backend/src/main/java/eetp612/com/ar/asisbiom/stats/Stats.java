package eetp612.com.ar.asisbiom.stats;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.ToString;

@Data
@Table(name = "stats")
@ToString
@Entity
public class Stats {
    @Id
    private String tipo;

    @Column(name = "cant_alumnos")
    private int cantidadAlumnos;

    @Column(name = "cant_personal")
    private int cantidadPersonal;

    public Stats() {
    }

    public Stats(String tipo) {
        this.tipo = tipo;
        this.cantidadAlumnos = 0;
        this.cantidadPersonal = 0;
    }

    
}
