import ChatWindow from "../components/ChatWindow";
import ChatSidebar from "../components/ChatSidebar";
export default function Home() {
    return (
        <div className="flex h-screen">
            <ChatSidebar />
            <ChatWindow />
        </div>
    )
}
