package eetp612.com.ar.asisbiom.notification;

import eetp612.com.ar.asisbiom.user.User;

public interface INotificationService {
    
    void sendNotification(Notification notification);

    Notification createNotification(Integer receiver_id, String content);
    Notification createNotification(User receiver, String content);

}
