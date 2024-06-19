package eetp612.com.ar.asisbiom.user;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import eetp612.com.ar.asisbiom.docentes.Roles;


public interface RoleRepository extends JpaRepository<Role, Integer> {
    List<Role> findByRole(Roles role);
}
