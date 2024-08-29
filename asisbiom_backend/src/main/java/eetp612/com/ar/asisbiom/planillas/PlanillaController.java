package eetp612.com.ar.asisbiom.planillas;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import eetp612.com.ar.asisbiom.general.Mes;

@RestController
@RequestMapping("/api/planilla")
public class PlanillaController {

    @Autowired
    private PlanillaService service;
    
    @GetMapping("/{curso}/{mes}")
    public ResponseEntity<?> getPlanillas(@PathVariable int curso, @PathVariable int mes)
    {
        return ResponseEntity.ok().body(service.planillaFileModelInit(Mes.values()[mes-1], curso));
    }
}
