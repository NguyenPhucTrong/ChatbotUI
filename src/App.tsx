import { useEffect, useState } from "react";
import SideBar from "./components/SideBar";
import Header from "./components/Header";
import Home from "./pages/Home";
import { Route, Routes, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ChatAI from "./pages/ChatAI";
import ChatHistoryModal from "./components/ChatHistoryModal";
import ProjectManagement from "./pages/ProjectManagement";

// Định nghĩa interface cho Message
interface Message {
  sender: "me" | "bot";
  text: string;
}

// Định nghĩa interface cho ChatHistory
interface ChatHistory {
  id: number;
  title: string;
  messages: Message[];
}

function App() {
  // Tin nhắn mặc định khi bắt đầu một đoạn chat mới
  const FMessages: Message[] = [
    { text: "Hi! How can I help you?", sender: "bot" },
  ];




  const sampleChat: Message[] = [
    { text: "Hello!", sender: "me" },
    { text: "Hi! How can I help you?", sender: "bot" },
    { text: "I need some information.", sender: "me" },
    { text: "Sure, what do you need to know?", sender: "bot" },
  ];

  const [messages, setMessages] = useState<Message[]>(FMessages);
  const [isChatHistoryOpen, setIsChatHistoryOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([
    { id: 1, title: "Chat 1", messages: sampleChat },
    // Thêm nhiều lịch sử chat khác ở đây
  ]);

  const handleOpenChatHistory = () => {
    setIsChatHistoryOpen(true);
  };

  const handleCloseChatHistory = () => {
    setIsChatHistoryOpen(false);
  };

  const handleSelectChat = (selectedMessages: Message[]) => {
    setMessages(selectedMessages);
    setIsChatHistoryOpen(false);
  };

  const handleNewChat = () => {
    if (messages.length > 0) {
      const newChatHistory = {
        id: chatHistory.length + 1,
        title: `Chat ${chatHistory.length + 1}`,
        messages: messages,
      };
      setChatHistory([...chatHistory, newChatHistory]);
    }
    setMessages(FMessages);
  };

  // Hàm xử lý khi gửi tin nhắn mới
  const handleMessages = (text: any) => {
    setMessages([...messages, { text, sender: "me" }]);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar chứa các liên kết và nút mở modal lịch sử chat */}
      <SideBar onOpenChatHistory={handleOpenChatHistory} />
      <div className="flex-1 flex flex-col">
        {/* Header của ứng dụng */}
        <Header />
        <div className="flex-1 overflow-auto">
          {/* Định nghĩa các route cho ứng dụng */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/project-management" element={<ProjectManagement />} />
            <Route path="/chatbot" element={
              <ChatAI
                messages={messages}
                onNewChat={handleNewChat}
                onSend={handleMessages}
                chatHistory={chatHistory}
                onSelectChat={handleSelectChat}
              />
            } />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
      {/* Modal lịch sử chat */}
      <ChatHistoryModal
        isOpen={isChatHistoryOpen}
        onClose={handleCloseChatHistory}
        chatHistory={chatHistory}
        onSelectChat={handleSelectChat}
      />
    </div>
  );

}

// Xuất component App
export default App;