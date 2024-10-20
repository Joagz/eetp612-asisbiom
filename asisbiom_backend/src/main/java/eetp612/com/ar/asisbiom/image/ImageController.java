package eetp612.com.ar.asisbiom.image;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import eetp612.com.ar.asisbiom.alumnos.Alumno;
import eetp612.com.ar.asisbiom.alumnos.AlumnoRepository;

import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.util.Optional;

@RestController
@RequestMapping("/api/image")
public class ImageController {

    @Value("${asisbiom.datapath}")
    private String path;

    @Autowired
    private AlumnoRepository alumnoRepository;

    @GetMapping("/{id_alumno}/{fecha}")
    public ResponseEntity<?> findByIdAlumnoAndFecha(@PathVariable("id_alumno") int id,
            @PathVariable("fecha") String fecha) {
        Optional<Alumno> found = alumnoRepository.findById(id);
        if (found.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("ID ALUMNO INVALIDA");
        }

        Alumno alumno = found.get();
        File file = new File(path + "img_" + fecha + "_" + alumno.getDni() + ".jpg");

        if (!file.exists()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("ARCHIVO NO ENCONTRADO");
        }

        FileSystemResource resource = new FileSystemResource(file);

        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .body(resource);
    }

    @PostMapping("save/{id}")
    public ResponseEntity<?> saveImage(@RequestParam("image") MultipartFile file, @PathVariable("id") int id) {
        if (file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("NO HAY DATOS PARA LEER");
        }
        Optional<Alumno> found = alumnoRepository.findById(id);
        if (found.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("ID ALUMNO INVALIDA");
        }
        Alumno alumno = found.get();

        try {
            File savedFile = new File(path + "img_" + LocalDate.now().toString() + "_" + alumno.getDni() + ".jpg");
            file.transferTo(savedFile);
            return ResponseEntity.status(HttpStatus.CREATED).body("Imagen subida con éxito");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("No se pudo subir la imagen: " + e.getMessage());
        }
    }
}
