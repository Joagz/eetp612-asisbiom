package eetp612.com.ar.asisbiom.user;

import com.fasterxml.jackson.annotation.JsonIgnore;

import eetp612.com.ar.asisbiom.docentes.Roles;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "users")
@Data
public class User {

    public User() {
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @JsonIgnore
    private String pwd;

    @Enumerated(EnumType.STRING)
    private Roles role;

    private String email;
    private String phone;

    @Column(name = "nombre_completo")
    private String nombreCompleto;

    private String dni;

    public User(String pwd, Roles role, String email, String phone, String dni, String nombreCompleto) {
        this.nombreCompleto=nombreCompleto;
        this.pwd = pwd;
        this.role = role;
        this.email = email;
        this.phone = phone;
        this.dni = dni;
    }

}
