import axios from "../services/Custom_axios";
import React, { createContext, useContext, useEffect, useState } from "react";

interface Notification {
  id: number;
  message: string;
  timestamp: string; // Sử dụng string để dễ lưu trữ trong LocalStorage
}

interface UserNotifications {
  [userId: string]: Notification[];
}

interface NotificationContextProps {
  notifications: UserNotifications;
  clearNotifications: (userId: string) => void;
  fetchNotifications: (userId: string) => void;
  playNotificationSound: () => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<UserNotifications>([]);

  const fetchNotifications = async (userId: string) => {
    if (!userId) return;
    try {
      const res = await axios.get(
        `/api/notifications/%7Bid%7D?idUser=${userId}`
      );
      console.log(res.data);
      setNotifications(res.data);
    } catch (error) {
      setNotifications((prev) => ({
        ...prev,
        [userId]: [],
      }));
    }
  };

  // Khôi phục thông báo từ LocalStorage khi ứng dụng khởi động
  useEffect(() => {
    const storedNotifications = localStorage.getItem("userNotifications");
    if (storedNotifications) {
      console.log(
        "Restoring notifications from LocalStorage:",
        JSON.parse(storedNotifications)
      );
      setNotifications(JSON.parse(storedNotifications));
    }
  }, []);

  // Hàm phát âm thanh thông báo
  const playNotificationSound = () => {
    console.log("playNotificationSound called");
    const audio = new Audio(
      "/assets/sounds/nhac_chuong_thong_bao_o_san_bay-www_tiengdong_com.mp3"
    );
    document.addEventListener(
      "click",
      () => {
        audio.play().catch((error) => {
          console.error("Error playing notification sound:", error.message);
        });
      },
      { once: true }
    );
  };

  // Hàm thêm thông báo cho người dùng
  //   const addNotificationForUser = (userId: string, message: string) => {
  //     console.log(
  //       `addNotificationForUser called for userId: ${userId}, message: "${message}"`
  //     );
  //     const newNotification: Notification = {
  //       id: Date.now(),
  //       message,
  //       timestamp: new Date().toISOString(),
  //     };

  //     // Lấy thông báo hiện tại từ LocalStorage
  //     const storedNotifications = JSON.parse(
  //       localStorage.getItem("userNotifications") || "{}"
  //     );
  //     console.log("Stored notifications before update:", storedNotifications);

  //     // Cập nhật thông báo
  //     const updatedNotifications = {
  //       ...storedNotifications,
  //       [userId]: [...(storedNotifications[userId] || []), newNotification],
  //     };

  //     // Lưu thông báo mới vào LocalStorage
  //     localStorage.setItem(
  //       "userNotifications",
  //       JSON.stringify(updatedNotifications)
  //     );
  //     console.log(
  //       "Updated notifications in LocalStorage:",
  //       localStorage.getItem("userNotifications")
  //     );

  //     // Cập nhật state
  //     setNotifications(updatedNotifications);

  //     // Phát âm thanh thông báo
  //     playNotificationSound();
  //   };

  // Hàm xóa tất cả thông báo của một người dùng
  const clearNotifications = (userId: string) => {
    console.log(`clearNotifications called for userId: ${userId}`);
    setNotifications((prev) => {
      const updated = { ...prev };
      delete updated[userId];
      console.log("Notifications after clearing:", updated);

      // Cập nhật LocalStorage
      localStorage.setItem("userNotifications", JSON.stringify(updated));
      console.log(
        "Updated notifications in LocalStorage after clearing:",
        localStorage.getItem("userNotifications")
      );

      return updated;
    });
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, fetchNotifications, clearNotifications, playNotificationSound }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};
