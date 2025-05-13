import React from "react";
import { useNotification } from "../context/NotificationProvider";

const NotificationBar: React.FC = () => {
    const { notifications, clearNotifications } = useNotification();

    return (
        <div className="fixed top-0 left-0 w-full bg-blue-500 text-white p-4 z-50">
            {notifications.length > 0 ? (
                <div>
                    {notifications.map((notification) => (
                        <div key={notification.id} className="mb-2">
                            {notification.message} - {notification.timestamp.toLocaleTimeString()}
                        </div>
                    ))}
                    <button
                        onClick={clearNotifications}
                        className="mt-2 bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded"
                    >
                        Clear All
                    </button>
                </div>
            ) : (
                <p>No notifications</p>
            )}
        </div>
    );
};

export default NotificationBar;