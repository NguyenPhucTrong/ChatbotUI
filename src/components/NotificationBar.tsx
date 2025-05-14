import React from "react";
import { useNotification } from "../context/NotificationProvider";

const NotificationBar: React.FC = () => {
    const { notifications, clearNotifications } = useNotification();
    const userId = localStorage.getItem("userId");

    // Lấy thông báo của user hiện tại
    const userNotifications = userId ? notifications[userId] || [] : [];
    console.log("Notifications for userId:", userId, userNotifications);
    return (
        <div className="fixed top-0 left-0 w-full bg-blue-500 text-white p-4 z-50">
            {userNotifications.length > 0 ? (
                <div>
                    {userNotifications.map((notification) => (
                        <div key={notification.id} className="mb-2">
                            {notification.message} -{" "}
                            {new Date(notification.timestamp).toLocaleTimeString()}
                        </div>
                    ))}
                </div>
            ) : (
                <p>No notifications</p>
            )}
        </div>
    );
};

export default NotificationBar;