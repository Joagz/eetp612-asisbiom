package eetp612.com.ar.asisbiom.user;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import eetp612.com.ar.asisbiom.docentes.Docente;
import eetp612.com.ar.asisbiom.docentes.DocenteRepository;

import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/auth/v1")
public class AuthController {

    private static final String EMAIL_REGEX_PATTERN = "^(?=.{1,64}@)[A-Za-z0-9_-]+(\\.[A-Za-z0-9_-]+)*@"
            + "[^-][A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)*(\\.[A-Za-z]{2,})$";

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private DocenteRepository docenteRepository;

    @Autowired
    private PasswordEncoder encoder;

    // Registrar un nuevo usuario
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserDto user) {

        // NO PERMITIR USUARIOS CON ESTAS RELACIONES
        if (user.id_docente() <= 1 || user.id_role() <= 1)
            return ResponseEntity.status(HttpStatusCode.valueOf(403)).build();

        if (!userRepository.findByEmail(user.email()).isEmpty()) {
            return ResponseEntity.badRequest().body("El correo electrónico está en uso.");
        }

        if (!userRepository.findByPhone(user.phone()).isEmpty()) {
            return ResponseEntity.badRequest().body("El teléfono está en uso.");
        }

        Optional<Role> foundRole = roleRepository.findById(user.id_role());
        Optional<Docente> foundDocente = docenteRepository.findById(user.id_docente());

        if (!foundRole.isPresent()) {
            return ResponseEntity.badRequest().body("El ROL que se le quiere asignar al usuario no existe.");
        }
        if (!foundDocente.isPresent()) {
            return ResponseEntity.badRequest().body("El DOCENTE que se le quiere asignar al usuario no existe.");
        }

        if (!Pattern.compile(EMAIL_REGEX_PATTERN).matcher(user.email()).matches()) {
            return ResponseEntity.badRequest().body("Correo electrónico no válido.");
        }

        User toSave = new User(encoder.encode(user.pwd()), foundDocente.get(), foundRole.get(), user.email(),
                user.phone());

        return ResponseEntity.ok().body(userRepository.save(toSave));
    }

    // Servirá para que el usuario recupere su token JWT
    @RequestMapping("/user")
    public User getUserDetailsAfterLogin(Authentication authentication) {
        List<User> customers = userRepository.findByEmail(authentication.getName());
        if (customers.size() > 0) {
            return customers.get(0);
        } else {
            return null;
        }
    }

    @GetMapping("/jwt-credentials-check")
    public ResponseEntity<?> jwtCredentialsCheck() {
        return ResponseEntity.ok().build();
    }
}
