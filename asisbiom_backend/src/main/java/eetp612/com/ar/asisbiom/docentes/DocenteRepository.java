package eetp612.com.ar.asisbiom.docentes;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DocenteRepository extends JpaRepository<Docente, Integer> {

    List<Docente> findByDni(String dni);

    List<Docente> findByCargoDocente(CargoDocente cargoDocente);

    List<Docente> findByNombreCompleto(String nombreCompleto);

}
