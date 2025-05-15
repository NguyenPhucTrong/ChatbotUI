import React from "react";
import MessageInput from "../components/MessageInput";
import MessageList from "../components/MessageList";

// Định nghĩa interface cho Message
interface Message {
    sender: "me" | "bot";
    text: string;
}

// Định nghĩa interface cho các props của ChatAI
interface ChatAIProps {
    messages: Message[];
    onNewChat: () => void;
    onSend: (text: string) => void;
    chatHistory: { id: number, title: string, messages: Message[] }[];
    onSelectChat: (selectedMessages: Message[]) => void;
}

// Component ChatAI
export default function ChatAI({ messages, onNewChat, onSend }: ChatAIProps) {
    return (
        <div className="flex-1 flex flex-col h-full">
            {/* Component hiển thị danh sách tin nhắn */}
            <MessageList messages={messages} onNewChat={onNewChat} />
            {/* Component nhập và gửi tin nhắn */}
            <MessageInput onSend={onSend} />
        </div>
    );
}