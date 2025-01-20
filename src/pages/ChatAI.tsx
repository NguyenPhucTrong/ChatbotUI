import { useState } from "react";
import MessageInput from "../components/MessageInput";
import MessageList from "../components/MessageList";

interface Message {
    sender: "me" | "bot";
    text: string;
}



export default function ChatAI() {

    const FMessages: Message[] = [
        { text: "Hi! How can I help you?", sender: "bot" },
    ];

    const [messages, setMessages] = useState<Message[]>(FMessages);

    const handleMessages = (text: any) => {
        setMessages([...messages, { text, sender: "me" }])

    }
    return (
        <div className="flex-1 flex flex-col h-full">
            <MessageList messages={messages} />
            <MessageInput onSend={handleMessages} />

        </div>
    )
}
