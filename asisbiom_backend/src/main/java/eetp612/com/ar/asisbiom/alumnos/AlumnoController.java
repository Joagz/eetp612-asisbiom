
/*
 * Autor: Joaquín Gómez 
 * EETP N.612 "Eudocio de los Santos Giménez", Coronda, Santa Fe
 */
package eetp612.com.ar.asisbiom.alumnos;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import eetp612.com.ar.asisbiom.mqtt.MqttService;
import eetp612.com.ar.asisbiom.stats.StatsService;
import eetp612.com.ar.asisbiom.user.User;
import eetp612.com.ar.asisbiom.user.UserRepository;
import eetp612.com.ar.asisbiom.asistencias.Asistencia;
import eetp612.com.ar.asisbiom.asistencias.AsistenciaRepository;
import eetp612.com.ar.asisbiom.conteoasistencias.ConteoAsistencia;
import eetp612.com.ar.asisbiom.conteoasistencias.ConteoRepository;
import eetp612.com.ar.asisbiom.cursos.Curso;
import eetp612.com.ar.asisbiom.cursos.CursoRepository;
import eetp612.com.ar.asisbiom.docentes.CursoDocente;
import eetp612.com.ar.asisbiom.docentes.CursoDocenteRepository;
import eetp612.com.ar.asisbiom.docentes.Docente;
import eetp612.com.ar.asisbiom.docentes.DocenteRepository;
import eetp612.com.ar.asisbiom.general.DateUtils;
import eetp612.com.ar.asisbiom.horarios.Horario;
import eetp612.com.ar.asisbiom.horarios.HorarioRepository;
import eetp612.com.ar.asisbiom.mqtt.MqttResponseAsistenciaWrapper;

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

record AlumnosCurso(
        Curso curso,
        List<Alumno> alumnos) {
}

@RestController
@RequestMapping("/api/alumno")
public class AlumnoController {

    @Autowired
    private AlumnoRepository alumnoRepository;

    @Autowired
    private MqttService mqttService;

    @Autowired
    private ConteoRepository conteoRepository;

    @Autowired
    private DocenteRepository docenteRepository;

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

    @Autowired
    private CursoDocenteRepository cursoDocenteRepository;

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
        return new ResponseEntity<Alumno>(alumno, HttpStatus.OK);
    }

    @PostMapping("/retirar/{idDocente}/{idAlumno}")
    public ResponseEntity<?> retirar(@PathVariable("idDocente") Integer idDocente,
            @PathVariable("idAlumno") Integer idAlumno) {

        Optional<Docente> foundDocente = docenteRepository.findById(idDocente);
        Optional<Alumno> foundAlumno = alumnoRepository.findById(idAlumno);

        if (!foundAlumno.isPresent())
            return ResponseEntity.status(404)
                    .body("Huella del alumno no encontrada.");

        if (!foundDocente.isPresent())
            return ResponseEntity.status(404)
                    .body("Huella del docente no encontrada.");

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
    public ResponseEntity<?> asistir(@PathVariable("id") Integer id,
            @RequestParam(required = false) boolean comingFromClient) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        List<User> usersFound = userRepository.findByEmail(auth.getPrincipal().toString());
        if (usersFound.isEmpty())
            return ResponseEntity.status(403).body("No se encontró un usuario con el correo " + auth.getPrincipal());

        User user = usersFound.get(0);
        Docente docente = user.getDocente();
        List<CursoDocente> cursoDocenteFound = cursoDocenteRepository.findByDocente(docente);

        if (cursoDocenteFound.isEmpty())
            return ResponseEntity.status(403)
                    .body("El docente con el correo " + auth.getPrincipal() + " no tiene cursos a cargo");

        Optional<Alumno> found = alumnoRepository.findById(id);
        if (found.isPresent()) {

            Alumno alumno = found.get();
            MqttResponseAsistenciaWrapper wrapper = mqttService.asistir(alumno);
            boolean access = false;

            for (CursoDocente cd : cursoDocenteFound) {
                if (cd.getCurso().equals(alumno.getCurso())) {
                    access = true;
                    break;
                }
            }

            if (!access)
                return ResponseEntity.status(403)
                        .body("El docente con el correo " + auth.getPrincipal() + " no tiene el curso a cargo");

            switch (wrapper.response()) {
                case NO_HORARIO:
                    return ResponseEntity.ok().body(wrapper);
                case OK:
                    statsService.addAlumnoToPresentes();
                    return ResponseEntity.ok().body(wrapper);
                case RETIRAR:
                    if (!comingFromClient)
                        return ResponseEntity.status(200).header("Accept-confirm", "confirm-retirar")
                                .body(wrapper);
                default:
                    break;
            }
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
