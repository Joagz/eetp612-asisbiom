package eetp612.com.ar.asisbiom.user;

import java.util.List;
import java.util.Optional;

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

    @GetMapping("/by-id/{id}")
    public ResponseEntity<?> findById(@PathVariable("id") int id) {
        Optional<User> found = userRepository.findById(id);
        
        if(found.isPresent())
        {
            return ResponseEntity.ok().body(found.get());
        }

        return ResponseEntity.notFound().build();
    }

    @GetMapping("/finger/{id}")
    public ResponseEntity<?> findByFingerId(@PathVariable("id") int id) {
        List<User> found = userRepository.findByFingerId(id);
        
        if(!found.isEmpty())
        {
            return ResponseEntity.ok().body(found.get(0));
        }

        return ResponseEntity.notFound().build();
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

    @PutMapping("/finger-id/{email}")
    public ResponseEntity<?> editRole(@PathVariable("email") String email, @RequestParam("id") int id) {

        List<User> found = userRepository.findByEmail(email);

        if (found.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = found.get(0);

        user.setFingerId(id);

        return ResponseEntity.ok().body(userRepository.save(user));
    }

}
