import { useState } from "react";
import ChatWindow from "../components/ChatWindow";
import ChatSidebar from "../components/ChatSidebar";

export default function Home() {
    const [selectedConversationId, setSelectedConversationId] = useState<number>(1);
    const [conversations, setConversations] = useState([
        { id: 1, name: "Chatbot 1", status: "Always here to help", img: "/path/to/image" },
        { id: 2, name: "Chatbot 2", status: "Ready to assist", img: "/path/to/image" },
        { id: 3, name: "Chatbot 3", status: "How can I help?", img: "/path/to/image" }
    ]);

    const handleNewConversation = (id: number) => {
        const newConversation = { id, name: `Chatbot ${id}`, status: "Can I help you?", img: "/path/to/image" };
        setConversations([...conversations, newConversation]);
        setSelectedConversationId(id);
    };

    return (
        <div className="flex h-screen">
            <ChatSidebar onSelectChat={setSelectedConversationId} conversations={conversations} />
            <ChatWindow selectedConversationId={selectedConversationId} onNewConversation={handleNewConversation} />
        </div>
    );
}