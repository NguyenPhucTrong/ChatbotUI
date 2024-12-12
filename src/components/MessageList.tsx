
interface Message {
    sender: "me" | "them"; // Chỉ định rõ hai giá trị có thể có
    text: any;
}

interface MessageListProps {
    messages: Message[];
}

export default function MessageList({ messages }: MessageListProps) {
    return (
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {messages.map((message, index) => (
                <div
                    key={index}
                    className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"
                        } mb-4`}
                >
                    <div
                        className={`p-3 rounded-lg ${message.sender === "me"
                            ? " bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-800"
                            }`}
                    >
                        {message.text}
                    </div>
                </div>
            ))}
        </div>
    )
}
