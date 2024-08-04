package eetp612.com.ar.asisbiom.stats;

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

    private Long valor;

    public Stats() {
    }

    public Stats(String tipo) {
        this.tipo = tipo;
        this.valor = 0l;
    }
    
}
