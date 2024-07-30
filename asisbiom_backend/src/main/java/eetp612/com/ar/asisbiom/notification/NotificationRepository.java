package eetp612.com.ar.asisbiom.notification;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import eetp612.com.ar.asisbiom.user.User;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {
    List<Notification> findByReceiver(User receiver);
}
