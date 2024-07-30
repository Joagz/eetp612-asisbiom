package eetp612.com.ar.asisbiom.notification;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import eetp612.com.ar.asisbiom.user.User;
import eetp612.com.ar.asisbiom.user.UserRepository;

@RestController
@RequestMapping("/api/notification")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/{receiver_username}")
    public ResponseEntity<?> getByReceiver(@PathVariable("receiver_username") String receiver_username) {
        List<User> foundUser = userRepository.findByEmail(receiver_username);

        if (foundUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = foundUser.get(0);
        SimpleDateFormat format = new SimpleDateFormat("dd-MM-yyyy");
        List<Notification> list = new ArrayList<>();

        for (Notification noti : notificationRepository.findByReceiver(user)) {
            noti.setDateStr(format.format(noti.getDate()));
            list.add(noti);
        }

        return ResponseEntity.ok().body(list);
    }

}
