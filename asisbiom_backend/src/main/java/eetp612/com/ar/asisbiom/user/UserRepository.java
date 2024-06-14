package eetp612.com.ar.asisbiom.user;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {
    List<User> findByEmail(String email);
    List<User> findByPhone(String phone);
    List<User> findByRole(Role role);
}
