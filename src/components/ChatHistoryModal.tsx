import React from 'react';

// Định nghĩa interface cho Message
interface Message {
    sender: "me" | "bot";
    text: string;
}

// Định nghĩa interface cho các props của ChatHistoryModal
interface ChatHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    chatHistory: { id: number, title: string, messages: Message[] }[];
    onSelectChat: (messages: Message[]) => void;
}

// Component ChatHistoryModal
export default function ChatHistoryModal({ isOpen, onClose, chatHistory, onSelectChat }: ChatHistoryModalProps) {
    // Nếu modal không mở, không hiển thị gì cả
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg w-1/2">
                <h2 className="text-xl mb-4">Lịch sử chat</h2>
                <ul>
                    {/* Hiển thị danh sách các đoạn chat trong lịch sử */}
                    {chatHistory.map(chat => (
                        <li key={chat.id} className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => onSelectChat(chat.messages)}>
                            {chat.title}
                        </li>
                    ))}
                </ul>
                {/* Nút đóng modal */}
                <button className="mt-4 bg-red-500 px-4 py-2 rounded-lg text-white hover:bg-red-700" onClick={onClose}>
                    Đóng
                </button>
            </div>
        </div>
    );
}