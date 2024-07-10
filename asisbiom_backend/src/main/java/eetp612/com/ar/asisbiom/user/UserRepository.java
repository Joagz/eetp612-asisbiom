package eetp612.com.ar.asisbiom.user;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import eetp612.com.ar.asisbiom.docentes.Roles;

public interface UserRepository extends JpaRepository<User, Integer> {
    List<User> findByEmail(String email);
    List<User> findByPhone(String phone);
    List<User> findByRole(Roles role);
}
