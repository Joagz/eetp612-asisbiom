
/*
 * Autor: Joaquín Gómez 
 * EETP N.612 "Eudocio de los Santos Giménez", Coronda, Santa Fe
 */
package eetp612.com.ar.asisbiom.alumnos;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import eetp612.com.ar.asisbiom.asistencias.Asistencia;
import eetp612.com.ar.asisbiom.asistencias.AsistenciaRepository;
import eetp612.com.ar.asisbiom.conteoasistencias.ConteoAsistencia;
import eetp612.com.ar.asisbiom.conteoasistencias.ConteoRepository;
import eetp612.com.ar.asisbiom.cursos.Curso;
import eetp612.com.ar.asisbiom.cursos.CursoRepository;
import eetp612.com.ar.asisbiom.docentes.Roles;
import eetp612.com.ar.asisbiom.general.DateUtils;
import eetp612.com.ar.asisbiom.horarios.Horario;
import eetp612.com.ar.asisbiom.horarios.HorarioRepository;
import eetp612.com.ar.asisbiom.mqtt.MqttMessage;
import eetp612.com.ar.asisbiom.mqtt.MqttResponse;
import eetp612.com.ar.asisbiom.mqtt.MqttResponseAsistenciaWrapper;
import eetp612.com.ar.asisbiom.mqtt.MqttService;
import eetp612.com.ar.asisbiom.mqtt.MqttUtils;
import eetp612.com.ar.asisbiom.mqtt.SensorAction;
import eetp612.com.ar.asisbiom.stats.StatsService;
import eetp612.com.ar.asisbiom.user.User;
import eetp612.com.ar.asisbiom.user.UserRepository;

record AlumnosCurso(
        Curso curso,
        List<Alumno> alumnos) {
}

@RestController
@RequestMapping("/api/alumno")
public class AlumnoController {
    static MqttMessage nullMsg = new MqttMessage(
            MqttUtils.integerToByteArray(0),
            MqttUtils.integerToByteArray(0),
            MqttUtils.integerToByteArray(0),
            MqttUtils.integerToByteArray(0));

    @Autowired
    private AlumnoRepository alumnoRepository;

    @Autowired
    private MqttService mqttService;

    @Autowired
    private ConteoRepository conteoRepository;

    @Autowired
    private AsistenciaRepository asistenciaRepository;

    @Autowired
    private HorarioRepository horarioRepository;

    @Autowired
    private CursoRepository cursoRepository;

    @Autowired
    private StatsService statsService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Alumno> findAll() {
        return alumnoRepository.findAll();
    }

    @GetMapping("/{id}")
    public Alumno findById(@PathVariable("id") int id) {
        Optional<Alumno> found = alumnoRepository.findById(id);

        if (found.isPresent())
            return found.get();

        return null;
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> edit(@PathVariable("id") Integer id, @RequestBody AlumnoDto alumno) {

        Optional<Alumno> found = alumnoRepository.findById(id);
        if (found.isPresent()) {
            Alumno edit = found.get();
            List<Curso> foundCurso = cursoRepository.findByCurso(alumno.curso());

            if (!foundCurso.isEmpty()) {
                edit.setCorreoElectronico(alumno.correoElectronico());
                edit.setCurso(foundCurso.get(0));
                edit.setDni(alumno.dni());
                edit.setNombreCompleto(alumno.nombreCompleto());
                edit.setTelefono(alumno.telefono());

                return ResponseEntity.ok().body("Editado correctamente");
            }
        }
        return ResponseEntity.badRequest().body("Por favor revisa los parámetros");

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") Integer id) {

        return ResponseEntity.ok().body("Eliminado correctamente");
    }

    @GetMapping("/stats")
    public List<ConteoAsistencia> findAllAndStats() {
        return conteoRepository.findAll();
    }

    @GetMapping("/{curso}/{div}")
    public List<Alumno> getByCursoDiv(@PathVariable("curso") Integer curso, @PathVariable("div") Character div) {
        List<Curso> cursos = cursoRepository.findByCursoAndDivisionOrderByCursoAsc(curso, div);
        return alumnoRepository.findByCurso(cursos.get(0));
    }

    @GetMapping("/list-cursos")
    public List<AlumnosCurso> alumnosByCurso() {
        List<AlumnosCurso> alumnosCursos = new ArrayList<>();
        List<Curso> cursos = cursoRepository.findAll();
        cursos.sort(new Comparator<Curso>() {
            @Override
            public int compare(Curso arg0, Curso arg1) {
                return arg0.getCurso() - arg1.getCurso();
            };
        });

        cursos.forEach(curso -> {
            List<Alumno> alumnos = alumnoRepository.findByCurso(curso);
            alumnosCursos.add(new AlumnosCurso(curso, alumnos));
        });

        return alumnosCursos;
    }

    @GetMapping("/search")
    public ResponseEntity<?> getByIdOrDniOrNombreCompleto(
            @RequestParam(name = "id", required = false) Integer id,
            @RequestParam(name = "dni", required = false) String dni,
            @RequestParam(name = "nombre_completo", required = false) String nombre_completo) {

        if (id != null) {
            Optional<Alumno> found = alumnoRepository.findById(id);

            if (found.isPresent())
                return new ResponseEntity<>(found.get(), HttpStatus.OK);
        } else if (dni != null) {
            List<Alumno> found = alumnoRepository.findByDni(dni);

            if (!found.isEmpty())
                return new ResponseEntity<>(found.get(0), HttpStatus.OK);

        } else {
            List<Alumno> found = alumnoRepository.findByNombreCompleto(nombre_completo);

            if (!found.isEmpty())
                return new ResponseEntity<>(found.get(0), HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping("/latestid")
    public Integer getLatestId() {
        List<Alumno> alumnos = alumnoRepository.findAll();

        alumnos.sort(new Comparator<Alumno>() {
            @Override
            public int compare(Alumno arg0, Alumno arg1) {
                return arg1.getId() - arg0.getId();
            };
        });

        return alumnos.get(0).getId();
    }

    @PostMapping("/registrar")
    public ResponseEntity<?> register(@RequestBody AlumnoDto alumnoDto) {
        Optional<Curso> found = cursoRepository.findById(alumnoDto.curso());
        if (!found.isPresent())
            return new ResponseEntity<>("Curso no encontrado.", HttpStatus.BAD_REQUEST);

        Alumno alumno = alumnoDto.toAlumno(found.get());
        alumnoRepository.save(alumno);
        conteoRepository.save(new ConteoAsistencia(alumno));
        statsService.addAlumno();

        MqttMessage message = new MqttMessage();
        message.setAccion(MqttUtils.integerToByteArray(SensorAction.REGISTER.ordinal()));
        message.setIdAlumno(MqttUtils.integerToByteArray(alumno.getId()));
        MqttUtils.addToCounter();
        message.setMessageId(MqttUtils.integerToByteArray(MqttUtils.getCounter()));
        message.setSensorId(MqttUtils.integerToByteArray(1)); // por el momento

        try {
            mqttService.sendMessage(message);
            mqttService.sendMessage(nullMsg);

        } catch (Exception e) {
            System.out.println("NO SE PUDO ENVIAR EL MENSAJE -->" + e.getLocalizedMessage());
        }

        return new ResponseEntity<Alumno>(alumno, HttpStatus.OK);
    }

    @PostMapping("/retirar/{idAlumno}")
    public ResponseEntity<?> retirar(Authentication authentication, @PathVariable("idAlumno") Integer idAlumno) {

        List<User> foundUser = userRepository.findByEmail(authentication.getName());
        Optional<Alumno> foundAlumno = alumnoRepository.findById(idAlumno);

        if (!foundAlumno.isPresent())
            return ResponseEntity.status(404)
                    .body("Alumno no encontrada.");

        if (foundUser.isEmpty())
            return ResponseEntity.status(404)
                    .body("Docente no encontrado.");

        if (foundUser.get(0).getRole().equals(Roles.USUARIO)) {
            return ResponseEntity.status(403).build();
        }
        Alumno alumno = foundAlumno.get();

        List<Asistencia> asistencias = asistenciaRepository.findByAlumnoAndFecha(alumno, LocalDate.now());
        asistencias.stream().filter(asistencia -> asistencia.getHorarioRetiro() == null)
                .collect(Collectors.toList());
        List<Horario> horarioDeHoy = horarioRepository.findByCursoAndDiaOrderByDiaAsc(alumno.getCurso(),
                DateUtils.getDay());

        if (asistencias.isEmpty()) {
            return ResponseEntity.status(404)
                    .body("No hay asistencias para este alumno, no se puede retirar.");
        }

        if (horarioDeHoy.isEmpty()) {
            return ResponseEntity.status(404)
                    .body("No hay horarios hoy para este alumno.");
        }

        if (LocalTime.now().isAfter(horarioDeHoy.get(0).getHorarioSalida())) {
            return ResponseEntity.status(400)
                    .body("No se puede retirar, el horario se salida es anterior al actual.");
        }

        mqttService.retirar(foundAlumno.get(), asistencias.get(0));

        return ResponseEntity.ok().body("Retirado con éxito a las " + LocalTime.now());
    }

    @PostMapping("/asistir/{id}")
    public ResponseEntity<?> asistir(@PathVariable("id") Integer id, @RequestParam("set") boolean set) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        List<User> usersFound = userRepository.findByEmail(auth.getPrincipal().toString());
        // TODO: ver si el usuario que se encuentra tiene este curso a cargo

        Optional<Alumno> found = alumnoRepository.findById(id);
        if (found.isPresent()) {
            Alumno alumno = found.get();

            List<Asistencia> asistenciasFound = asistenciaRepository.findByAlumnoAndFecha(alumno, LocalDate.now());
            if (set && asistenciasFound.isEmpty()) {
                MqttResponseAsistenciaWrapper wrapper = mqttService.asistir(alumno);
                switch (wrapper.response()) {
                    case NO_HORARIO:
                        return ResponseEntity.accepted().body(wrapper);
                    case OK:
                        statsService.addAlumnoToPresentes();
                        return ResponseEntity.ok().body(wrapper);
                    case RETIRAR:

                        return ResponseEntity.accepted().body(wrapper);
                    default:
                        break;
                }
            } else if (!asistenciasFound.isEmpty()) {
                Asistencia toDisable = asistenciasFound.get(0);
                toDisable.setEnabled(set);

                MqttResponseAsistenciaWrapper wrapper = new MqttResponseAsistenciaWrapper(
                        asistenciaRepository.save(toDisable), MqttResponse.OK);

                return ResponseEntity.ok().body(wrapper);
            }
        }

        MqttResponseAsistenciaWrapper wrapper = new MqttResponseAsistenciaWrapper(null, MqttResponse.OK);
        return ResponseEntity.ok().body(wrapper);
    }

    @PostMapping("/tardanza/{id}")
    public ResponseEntity<?> tardanza(@PathVariable("id") Integer id, @RequestParam("set") boolean set) {
        Optional<Alumno> found = alumnoRepository.findById(id);

        if (found.isPresent()) {
            Alumno alumno = found.get();
            List<Asistencia> asistenciasFound = asistenciaRepository.findByAlumnoAndFecha(alumno, LocalDate.now());

            if (asistenciasFound.isEmpty()) {
                return ResponseEntity.ok().build();
            }

            Asistencia toUpdate = asistenciasFound.get(0);
            toUpdate.setTardanza(set);

            MqttResponseAsistenciaWrapper wrapper = new MqttResponseAsistenciaWrapper(
                    asistenciaRepository.save(toUpdate), MqttResponse.OK);
            return ResponseEntity.ok().body(wrapper);
        }

        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/remover/{idAlumno}")
    public ResponseEntity<?> removerAlumno(@PathVariable Integer idAlumno) {

        Optional<Alumno> foundAlumno = alumnoRepository.findById(idAlumno);
        if (foundAlumno.isPresent()) {
            Alumno alumno = foundAlumno.get();
            alumno.setCurso(null);

            alumnoRepository.save(alumno);

            return ResponseEntity.ok().body(alumno);
        }

        return ResponseEntity.notFound().build();

    }

    @GetMapping("/documento/{dni}")
    public ResponseEntity<?> findByDocumento(@PathVariable("dni") String dni) {
        List<Alumno> found = alumnoRepository.findByDni(dni);
        if (!found.isEmpty()) {
            return ResponseEntity.ok().body(found.get(0));
        }
        return ResponseEntity.notFound().build();
    }

}
