package eetp612.com.ar.asisbiom.reportes;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.parameters.RequestBody;

@RestController
@RequestMapping("/api/reportes")
public class ReporteController {

    @Autowired
    private ReporteRepository reporteRepository;

    @GetMapping()
    public List<Reporte> findAll() {
        return reporteRepository.findAll();
    }

    @GetMapping("{id}")
    public Reporte findById(@PathVariable("id") int id) {
        Optional<Reporte> found;
        if ((found = reporteRepository.findById(id)).isPresent()) {
            return found.get();
        }
        return null;
    }

    @PostMapping()
    public ResponseEntity<?> add(@RequestBody Reporte reporte) {
        reporte.setFecha(LocalDate.now());
        return ResponseEntity.ok().body(reporteRepository.save(reporte));
    }

}
