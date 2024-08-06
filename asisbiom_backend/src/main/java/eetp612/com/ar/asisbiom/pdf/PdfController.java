package eetp612.com.ar.asisbiom.pdf;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/pdf")
public class PdfController {
    @Autowired
    private PdfRepository pdfRepository;

    @Autowired
    private ResourcePatternResolver resourcePatternResolver;

    @GetMapping
    public List<String> getUrls() throws IOException {
        Resource[] resources = resourcePatternResolver.getResources("classpath:/pdf/*.pdf");
        List<String> files = new ArrayList<>();
        for(Resource resource : resources)
        {
            files.add(resource.getFilename());
        }
        return files;
    }

    @ExceptionHandler({ IOException.class })
    public ResponseEntity<?> handleIoException() {
        return ResponseEntity.badRequest().body("Archivo no encontrado o error en la lectura");
    }

    @GetMapping("/{name}")
    public ResponseEntity<?> getPdf(@PathVariable("name") String name) throws IOException {

        ClassPathResource classPathResource = new ClassPathResource("/pdf/" + name);

        return ResponseEntity.ok()
                .contentLength(classPathResource.getFile().length())
                .contentType(MediaType.parseMediaType("application/pdf"))
                .body(classPathResource.getContentAsByteArray());

    }

}
