package eetp612.com.ar.asisbiom.pdf;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PdfRepository extends JpaRepository<Pdf, Integer> {
    List<Pdf> findByName(String name);
}
