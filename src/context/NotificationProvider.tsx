import React, { createContext, useContext, useEffect, useId, useState } from "react";

interface Notification {
    id: number;
    message: string;
    timestamp: Date;
}

interface UserNotifications {
    [useId: string]: Notification[];
}

interface NotificationContextProps {
    notifications: UserNotifications;
    addNotification: (message: string) => void;
    clearNotifications: (useId: string) => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Lấy thông báo từ LocalStorage khi khởi tạo
    const [notifications, setNotifications] = useState<UserNotifications>(() => {
        const storedNotifications = localStorage.getItem("userNotifications");
        return storedNotifications ? JSON.parse(storedNotifications) : [];
    }
    );


    // Lưu thông báo vào LocalStorage mỗi khi danh sách thông báo thay đổi

    useEffect(() => {
        localStorage.setItem("userNotifications", JSON.stringify(notifications));
    }
        , [notifications]);

    const playNotificationSound = () => {
        const audio = new Audio("/assets/sound/nhac_chuong_thong_bao_o_san_bay-www_tiengdong_com.mp3");
        audio.play().catch((error) => {
            console.error("Error playing notification sound:", error);
        });
    }

    const addNotificationForUser = (userId: string, message: string) => {
        const newNotification = { id: Date.now(), message, timestamp: new Date()