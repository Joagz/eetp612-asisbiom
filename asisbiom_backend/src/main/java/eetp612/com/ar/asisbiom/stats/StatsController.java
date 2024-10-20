package eetp612.com.ar.asisbiom.stats;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/stats")
public class StatsController {

    @Autowired
    private StatsService service;

    @GetMapping("finger")
    private Integer getLastFinger() {
        return service.addNextFinger();
    }

    @GetMapping("puntaje")
    private List<Float> getPuntaje(
            @RequestParam(name = "positive-only", defaultValue = "0", required = false) boolean positiveOnly) {
        List<Float> puntaje = service.getPuntaje();
        Float min = puntaje.get(0);

        if (positiveOnly && min < 0) {
            return service.getPuntajePositivo();
        } else
            return puntaje;
    }

    @GetMapping("/asistencias/porcentaje")
    public ResponseEntity<?> porcentajeAsistencias() {
        return ResponseEntity.ok().body(service.porcentajeAsistencias());
    }

    @GetMapping("/puntualidad/porcentaje")
    public ResponseEntity<?> porcentajePuntualidad() {
        return ResponseEntity.ok().body(service.porcentajePuntualidad());
    }

    @GetMapping("/distribucion-normal")
    public ResponseEntity<?> promedioPuntualidad() {
        return ResponseEntity.ok().body(service.distribucionNormal());
    }

    @GetMapping("/lorenz")
    public List<Float> lorenz() {
        return service.curvaLorenz();
    }

    @GetMapping("/gini")
    public Float gini() {
        return service.indiceGini();
    }

}
