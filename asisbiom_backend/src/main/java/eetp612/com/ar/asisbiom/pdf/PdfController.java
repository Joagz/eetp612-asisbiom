package eetp612.com.ar.asisbiom.pdf;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

@RestController
@RequestMapping("/api/pdf")
public class PdfController {
    @Autowired
    private PdfRepository pdfRepository;

    @Autowired
    private ResourcePatternResolver resourcePatternResolver;

    @Autowired
    private ResourceLoader resourceLoader;

    @GetMapping
    public List<String> getUrls() throws IOException {
        Resource[] resources = resourcePatternResolver.getResources("classpath:/pdf/*.pdf");
        List<String> files = new ArrayList<>();
        for (Resource resource : resources) {
            files.add(resource.getFilename());
        }
        return files;
    }

    @ExceptionHandler({ IOException.class })
    public ResponseEntity<?> handleIoException() {
        return ResponseEntity.badRequest().body("Archivo no encontrado o error en la lectura");
    }

    @GetMapping("/{name}")
    public ResponseEntity<StreamingResponseBody> getPdf(@PathVariable("name") String name) {
        try {
            Resource resource = resourceLoader.getResource("classpath:pdf/" + name);
            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }

            InputStream inputStream = resource.getInputStream();
            StreamingResponseBody responseBody = outputStream -> {
                byte[] buffer = new byte[1024];
                int bytesRead;
                while ((bytesRead = inputStream.read(buffer)) != -1) {
                    outputStream.write(buffer, 0, bytesRead);
                }
            };

            HttpHeaders headers = new HttpHeaders();
            headers.set(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_PDF_VALUE);
            headers.setContentLength(resource.contentLength());

            return new ResponseEntity<>(responseBody, headers, HttpStatus.OK);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
