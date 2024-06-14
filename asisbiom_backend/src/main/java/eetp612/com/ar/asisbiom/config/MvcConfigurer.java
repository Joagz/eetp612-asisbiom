package eetp612.com.ar.asisbiom.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import eetp612.com.ar.asisbiom.converter.StringToDiaConverter;
import eetp612.com.ar.asisbiom.converter.StringToHoraConverter;

@Configuration
@EnableWebMvc
public class MvcConfigurer implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(@SuppressWarnings("null") CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("*")
            .allowedMethods("PUT", "DELETE", "GET", "POST")
            .allowedHeaders("*")
            .allowCredentials(false).maxAge(3600);
    }

    @Override
    public void addFormatters(FormatterRegistry registry) {
        registry.addConverter(new StringToDiaConverter());
        registry.addConverter(new StringToHoraConverter());
    }


}