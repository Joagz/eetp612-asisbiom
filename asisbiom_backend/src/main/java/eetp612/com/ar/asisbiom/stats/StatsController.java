package eetp612.com.ar.asisbiom.stats;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping("/stats")
public class StatsController {

    @Autowired
    private StatsService service;

    @GetMapping
    private List<Long> getPuntaje() {
        return service.getPuntaje();
    }

}
