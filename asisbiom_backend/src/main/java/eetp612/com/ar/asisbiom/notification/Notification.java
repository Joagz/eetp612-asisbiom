package eetp612.com.ar.asisbiom.notification;

import java.util.Date;

import eetp612.com.ar.asisbiom.user.User;
import jakarta.annotation.Nullable;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Transient;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
@Entity(name = "notification")
public class Notification {
    

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String content;

    @JoinColumn(name = "receiver_id")
    @ManyToOne(fetch = FetchType.LAZY)
    private User receiver;

    @Nullable
    private Date date;

    private boolean sent;

    // 0 = default
    // 1 = importante
    // 2 = urgente
    private int urgencia;

    @Transient
    private String dateStr;

}
