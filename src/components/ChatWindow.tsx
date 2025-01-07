import { useState, useEffect } from "react";
import HeaderWindow from "./HeaderWindow";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

interface Message {
    sender: "me" | "them";
    text: string;
}

const FMessages: { [key: number]: Message[] } = {
    1: [
        { text: "Hi! How can I help you?", sender: "them" },
        { text: "Hi! How can I help you?", sender: "me" }
    ],
    2: [
        { text: "Hello! Need any assistance?", sender: "them" },
        { text: "Yes, please.", sender: "me" }
    ],
    3: [
        { text: "Good day! How can I assist you?", sender: "them" },
        { text: "I have a question.", sender: "me" }
    ]
};

interface ChatWindowProps {
    selectedConversationId: number;
    onNewConversation: (id: number) => void;
}

function ChatWindow({ selectedConversationId, onNewConversation }: ChatWindowProps) {
    const [messages, setMessages] = useState<Message[]>(FMessages[selectedConversationId] || []);

    useEffect(() => {
        setMessages(FMessages[selectedConversationId] || []);
    }, [selectedConversationId]);

    const handleMessages = (text: string) => {
        const newMessages: Message[] = [...messages, { text, sender: "me" }];
        setMessages(newMessages);
        FMessages[selectedConversationId] = newMessages;
    };

    const handleNewChat = () => {
        const newConversationId = Object.keys(FMessages).length + 1;
        const newMessages: Message[] = [{ text: "Can I help you?", sender: "them" }];
        FMessages[newConversationId] = newMessages;
        onNewConversation(newConversationId);
    };

    return (
        <div className="flex-1 flex flex-col">
            {/* Header */}
            <HeaderWindow onNewChat={handleNewChat} />

            {/* Messages */}
            <MessageList messages={messages} />

            {/* Input */}
            <MessageInput onSend={handleMessages} />
        </div>
    );
}

export default ChatWindow;