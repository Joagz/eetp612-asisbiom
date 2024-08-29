package eetp612.com.ar.asisbiom.planillas;

import eetp612.com.ar.asisbiom.general.Mes;

public interface IPlanillaService {
    Planilla nuevaPlanillaMensual(Mes mes, int cursoId);
    PlanillaFileModel planillaFileModelInit(Mes mes, int cursoId);
}
