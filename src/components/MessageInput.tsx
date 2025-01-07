import { useState } from "react";

interface MessageInputProps {
    onSend: (text: string) => void;
}

export default function MessageInput({ onSend }: MessageInputProps) {
    const [message, setMessage] = useState<string>("");

    const handleSend = () => {
        if (message.trim()) {
            onSend(message);
            setMessage("");
        }
    };

    const handleKeyDown = (e: any) => {
        if (e.key === "Enter") handleSend();
    };

    return (
        <div className="p-4 border-t border-gray-300 flex items-center">
            <input
                type="text"
                placeholder="Type your message here..."
                className="flex-1 ml-2 p-2 border border-gray-300 rounded-lg"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
            />
        </div>
    );
}