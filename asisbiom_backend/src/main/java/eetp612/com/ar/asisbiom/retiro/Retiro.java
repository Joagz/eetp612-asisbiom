package eetp612.com.ar.asisbiom.retiro;

import java.time.LocalTime;

import eetp612.com.ar.asisbiom.alumnos.Alumno;
import eetp612.com.ar.asisbiom.user.User;
import jakarta.annotation.Nullable;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
@Entity
@Table(name = "retirados")
public class Retiro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String razon;

    @Nullable
    private LocalTime fecha;

    @ManyToOne(fetch = FetchType.EAGER)
    private Alumno alumno;

    @ManyToOne(fetch = FetchType.EAGER)
    private User profesor;

}
