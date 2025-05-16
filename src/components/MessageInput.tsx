import React, { useState } from 'react';
import { FaLink } from "react-icons/fa";

// Định nghĩa interface cho các props của MessageInput
interface MessageInputProps {
    onSend: (text: string) => void;
}

// Component MessageInput
export default function MessageInput({ onSend }: MessageInputProps) {
    // State để quản lý nội dung tin nhắn hiện tại
    const [message, setMessage] = useState<string>("");

    // Hàm xử lý khi gửi tin nhắn
    const handleSend = () => {
        if (message.trim()) {
            onSend(message);
            setMessage(""); // Đặt lại nội dung tin nhắn sau khi gửi
        }
    };

    // Hàm xử lý khi nhấn phím Enter
    const handleKeyDown = (e: any) => {
        if (e.key === "Enter") handleSend();
    };

    // Hàm xử lý khi chọn file
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Xử lý file ở đây
        }
    };

    return (
        <div className="flex items-center p-4 border-t border-gray-300">
            {/* Input để nhập tin nhắn */}
            <input
                type="text"
                className="flex-1 p-2 border rounded-lg"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            {/* Nút gửi tin nhắn */}
            <button
                className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
                onClick={handleSend}
            >
                Send
            </button>
            {/* Nút chọn file */}
            {/* <label className="ml-4 cursor-pointer">
                <FaLink size={20} />
                <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                />
            </label> */}
        </div>
    );
}