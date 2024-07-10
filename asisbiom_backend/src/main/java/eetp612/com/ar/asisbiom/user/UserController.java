package eetp612.com.ar.asisbiom.user;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import eetp612.com.ar.asisbiom.docentes.Roles;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<User> findAll() {
        return userRepository.findAll();
    }

    @GetMapping("/{email}")
    public List<User> findByEmail(@PathVariable("email") String email) {
        return userRepository.findByEmail(email);
    }

    @PutMapping("/editrole/{email}")
    public ResponseEntity<?> editRole(@PathVariable("email") String email, @RequestParam("role") String role) {

        List<User> found = userRepository.findByEmail(email);

        if (found.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = found.get(0);

        user.setRole(Roles.valueOf(role));

        return ResponseEntity.ok().body(userRepository.save(user));
    }

}
