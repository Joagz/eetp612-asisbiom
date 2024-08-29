package eetp612.com.ar.asisbiom.planillas;

import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class PlanillaFileModel {
    private String filename;
    private int keys[][];
    private float inasistenciasMes[][];
    private float inasistenciasAnio[][];
}
