import { useState } from "react";
import HeaderWindow from "./HeaderWindow";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

interface Message {
    sender: any;
    text: any;
}


const FMessages: Message[] = [
    { text: "Hi Zoe!", sender: "me" },
    { text: "Hi, what's up?", sender: "bot" },
    {
        text: "I am pleased to announce that on this beautiful magical day of the Fall Equinox...",
        sender: "me",
    },
    { text: "...we have released the first version of the chat-ui-kit-react library", sender: "me" },
    { text: "That's great news!", sender: "bot" },
    { text: "you must be very excited", sender: "bot" },
    { text: "Yes I am :)", sender: "me" },
    { text: "Thank You :)", sender: "me" },
];

function ChatWindow() {

    const [messages, setMessages] = useState<Message[]>(FMessages)

    const handleMessages = (text: any) => {
        setMessages([...messages, { text, sender: "me" }])

    }

    const handleNewChat = () => {
        setMessages([{ text: "Can i help you?", sender: "bot" }])
    }


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