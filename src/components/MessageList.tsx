import React from 'react';

// Định nghĩa interface cho Message
interface Message {
    sender: "me" | "bot";
    text: string;
}

// Định nghĩa interface cho các props của MessageList
interface MessageListProps {
    messages: Message[];
    onNewChat: () => void;
}

// Component MessageList
export default function MessageList({ messages, onNewChat }: MessageListProps) {
    return (
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50 relative">
            {/* Hiển thị danh sách tin nhắn */}
            {messages.map((message, index) => (
                <div
                    key={index}
                    className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"
                        } mb-4`}
                >
                    <div
                        className={`p-3 rounded-lg ${message.sender === "me"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-800"
                            }`}
                    >
                        {message.text}
                    </div>
                </div>
            ))}
            {/* Nút tạo đoạn chat mới */}
            {/* <div className="absolute bottom-4 right-4">
                <button
                    className="bg-green-500 px-4 py-2 rounded-lg text-white hover:bg-green-400"
                    onClick={onNewChat}
                >
                    New Chat
                </button>
            </div> */}
        </div>
    );
}