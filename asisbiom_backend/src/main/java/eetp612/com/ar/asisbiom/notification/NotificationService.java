package eetp612.com.ar.asisbiom.notification;

import java.time.Instant;
import java.util.Date;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import eetp612.com.ar.asisbiom.user.User;
import eetp612.com.ar.asisbiom.user.UserRepository;

@Service
public class NotificationService implements INotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public void sendNotification(Notification notification) {
        notification.setSent(true);
        notification.setDate(Date.from(Instant.now()));
        notificationRepository.save(notification);
    }

    @Override
    public Notification createNotification(Integer receiver_id, String content) {

        Optional<User> found = userRepository.findById(receiver_id);

        if (!found.isPresent()) {
            return null;
        }

        Notification notification = new Notification();
        notification.setContent(content);
        notification.setSent(false);
        notification.setReceiver(found.get());
        notification.setDate(null);

        return notification;
    }

    @Override
    public Notification createNotification(User receiver, String content) {
        Notification notification = new Notification();
        notification.setContent(content);
        notification.setSent(false);
        notification.setReceiver(receiver);
        notification.setDate(null);

        return notification;
    }

}
