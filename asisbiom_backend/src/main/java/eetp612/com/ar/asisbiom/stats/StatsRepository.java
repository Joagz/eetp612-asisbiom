package eetp612.com.ar.asisbiom.stats;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StatsRepository extends JpaRepository<Stats, String> {
    List<Stats> findByTipo(String tipo);
}
