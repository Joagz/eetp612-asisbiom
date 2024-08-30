package eetp612.com.ar.asisbiom.planillas;

import java.util.List;

import eetp612.com.ar.asisbiom.alumnos.Alumno;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class PlanillaFileModel {
    private String filename;
    private int keys[][];
    private float inasistenciasMes[][];
    private float inasistenciasAnio[][];
    private int nDias;
    private int nAlumnos;
    private List<Alumno> alumnos;
}
