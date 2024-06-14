package eetp612.com.ar.asisbiom.user;

import com.fasterxml.jackson.annotation.JsonIgnore;

import eetp612.com.ar.asisbiom.docentes.Docente;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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

    @ManyToOne
    @JoinColumn(name = "id_docente")
    private Docente docente;

    @ManyToOne
    @JoinColumn(name = "id_role")
    private Role role;

    private String email;
    private String phone;

    public User(String pwd, Docente docente, Role role, String email, String phone) {
        this.pwd = pwd;
        this.docente = docente;
        this.role = role;
        this.email = email;
        this.phone = phone;
    }

}
