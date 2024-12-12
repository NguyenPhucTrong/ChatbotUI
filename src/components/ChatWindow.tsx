import flower1 from "../assets/image/flower1.png";


const messages = [
    { text: "Hi Zoe!", sender: "me" },
    { text: "Hi, what's up?", sender: "them" },
    {
        text: "I am pleased to announce that on this beautiful magical day of the Fall Equinox...",
        sender: "me",
    },
    { text: "...we have released the first version of the chat-ui-kit-react library", sender: "me" },
    { text: "That's great news!", sender: "them" },
    { text: "you must be very excited", sender: "them" },
    { text: "Yes I am :)", sender: "me" },
    { text: "Thank You :)", sender: "me" },
];

function ChatWindow() {

    // const [showOptions, setShowOptions] = useState(false);

    return (
        <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className=" flex flex-row-reverse p-4 bg-gray-300 text-white flex justify-between items-center">
                <img src={flower1} alt="Zoe" className="w-10 h-10 rounded-full" />
            </div>

            {/* Messages */}
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

            {/* Input */}
            <div className="p-4 border-t border-gray-300 flex items-center">
                <input
                    type="text"
                    placeholder="Type your message here..."
                    className="flex-1 p-2 border border-gray-300 rounded-lg"
                />
                <button className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
                    Send
                </button>
            </div>
        </div>
    );
}

export default ChatWindow;