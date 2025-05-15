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
        <div className="p-4 border-t border-gray-200 flex items-center">
            <div className=' relative p-4 rounded-lg hover:bg-gray-200 cursor-pointer'>
                <FaLink />
                <input
                    type="file"
                    className='absolute p-4 inset-0 opacity-0 cursor-pointer'
                    onChange={handleFileChange}
                />
            </div>

            <input
                type="text"
                placeholder="Type your message here..."
                className="flex-1 ml-2 p-2 border border-gray-300 rounded-lg"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <button onClick={handleSend} className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
                Send
            </button>
        </div>
    );
}