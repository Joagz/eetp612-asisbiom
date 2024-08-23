package eetp612.com.ar.asisbiom.reportes;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ReporteRepository extends JpaRepository<Reporte, Integer> {
    List<Reporte> findByNombreCompleto(String nombreCompleto);
    List<Reporte> findByTelefono(String telefono);
    List<Reporte> findByEmail(String email);
}
