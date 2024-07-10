package eetp612.com.ar.asisbiom.config;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import eetp612.com.ar.asisbiom.filter.CsrfCookieFilter;
import eetp612.com.ar.asisbiom.filter.JWTTokenGeneratorFilter;
import eetp612.com.ar.asisbiom.filter.JWTTokenValidatorFilter;

import java.util.Arrays;

@Configuration
public class SecurityConfig {

    @Bean
    SecurityFilterChain defaultSecurityFilterChain(HttpSecurity http) throws Exception {
        http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .cors(corsCustomizer -> corsCustomizer.configurationSource(new CorsConfigurationSource() {
                    @Override
                    public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
                        // TODO: configurar con el endpoint de el front
                        CorsConfiguration config = new CorsConfiguration();
                        config.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
                        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
                        config.setAllowCredentials(true);
                        config.setAllowedHeaders(Arrays.asList("*"));
                        config.setExposedHeaders(Arrays.asList("Authorization"));
                        config.setMaxAge(3600L);
                        return config;
                    }
                }))
                .csrf((csrf) -> csrf.disable())
                .addFilterAfter(new JWTTokenGeneratorFilter(),
                        BasicAuthenticationFilter.class)
                .addFilterBefore(new JWTTokenValidatorFilter(),
                        BasicAuthenticationFilter.class)
                .authorizeHttpRequests(req -> req.requestMatchers(

                        // Estadistica
                        "/api/estadistica/cantidades/**").permitAll()
                        .requestMatchers("/api/estadistica").authenticated()
                        .requestMatchers("/api/estadistica/_initialize").hasAnyAuthority("DEVELOPER")

                        // Alumnos
                        .requestMatchers(HttpMethod.GET, "/api/alumno/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/alumno/**")
                        .hasAnyAuthority("DEVELOPER", "DIRECTIVO", "SECRETARIO")
                        .requestMatchers(HttpMethod.DELETE, "/api/alumno/**")
                        .hasAnyAuthority("DEVELOPER", "DIRECTIVO", "SECRETARIO", "PRECEPTOR")
                        .requestMatchers(HttpMethod.PUT, "/api/alumno/**")
                        .hasAnyAuthority("DEVELOPER", "DIRECTIVO", "SECRETARIO", "PRECEPTOR")

                        .requestMatchers("/auth/v1/jwt-credentials-check").authenticated()
                        .requestMatchers("/auth/v1/user").permitAll()

                        .anyRequest().authenticated()
                // TODO: secure requests...

                )
                .formLogin(form -> form.disable())
                .httpBasic(Customizer.withDefaults());

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}