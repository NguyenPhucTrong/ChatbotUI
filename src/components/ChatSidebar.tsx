import { useState } from "react";

interface Conversation {
    id: number;
    name: string;
    status: string;
    img: string;
}

interface ChatSidebarProps {
    onSelectChat: (id: number) => void;
    conversations: Conversation[];
}

function ChatSidebar({ onSelectChat, conversations }: ChatSidebarProps) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredConversations = conversations.filter(conversation =>
        conversation.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-[350px] bg-gray-100 border-r border-gray-300 h-screen overflow-y-auto">
            {/* Search */}
            <div className="p-4">
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            {/* Conversations */}
            <ul>
                {filteredConversations.map((conversation) => (
                    <li
                        key={conversation.id}
                        className="p-4 h-20 flex items-center border-b border-gray-200 cursor-pointer hover:bg-gray-200"
                        onClick={() => onSelectChat(conversation.id)}
                    >

                        <div className="ml-4 flex-1">
                            <p className="text-sm text-gray-600">{conversation.status}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ChatSidebar;