import { useState } from "react";
import SideBar from "./components/SideBar";
import Header from "./components/Header";
import Home from "./pages/Home";
import { Route, Routes, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ChatAI from "./pages/ChatAI";
import ChatHistoryModal from "./components/ChatHistoryModal";
import ProjectManagement from "./pages/ProjectManagement";
import Profile from "./pages/Profile";
import AdminCompanyManagement from "./pages/AdminCompanyManagement";
import AdminUsersManagement from "./pages/AdminUsersManagement";
import AdminSMSFacebook from "./pages/AdminSMSFacebook";
import SuperadminManagement from "./pages/SuperadminManagement";
import MainLanding from "./pages/MainLanding";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import UploadFile from "./pages/UploadFile";
import SignUp from "./pages/SignUp";

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

  const location = useLocation();
  const isMainLanding = location.pathname === "/"
  const isLogin = location.pathname === "/login"
  const isSignUp = location.pathname === "/signup"

  // Tin nhắn mặc định khi bắt đầu một đoạn chat mới
  const FMessages: Message[] = [
    { text: "Hi! How can I help you?", sender: "bot" },
  ];



  // Đoạn chat mẫu để thêm vào lịch sử chat
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
  ]);

  // Hàm mở modal lịch sử chat
  const handleOpenChatHistory = () => {
    setIsChatHistoryOpen(true);
  };

  // Hàm đóng modal lịch sử chat
  const handleCloseChatHistory = () => {
    setIsChatHistoryOpen(false);
  };

  // Hàm chọn một đoạn chat từ lịch sử và hiển thị nó
  const handleSelectChat = (selectedMessages: Message[]) => {
    setMessages(selectedMessages);
    setIsChatHistoryOpen(false);
  };

  // Hàm tạo đoạn chat mới và lưu đoạn chat cũ vào lịch sử
  const handleNewChat = () => {
    // Lưu đoạn chat cũ vào lịch sử nếu có tin nhắn
    if (messages.length > 0) {
      const newChatHistory = {
        id: chatHistory.length + 1,
        title: `Chat ${chatHistory.length + 1}`,
        messages: messages,
      };
      setChatHistory([...chatHistory, newChatHistory]);
    }
    // Đặt lại danh sách tin nhắn về trạng thái ban đầu
    setMessages(FMessages);
  };

  // Hàm xử lý khi gửi tin nhắn mới
  const handleMessages = async (text: string) => {
    setMessages([...messages, { text, sender: "me" }]);

    try {
      const question = {
        idProject: 1,
        query: text
      }
      let res = await askQuestion(question); // Gửi query trực tiếp
      console.log("Response:", res);
      if (res.status === 200) {
        const botMessage = res.data.Answer; // Lấy câu trả lời từ response
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: botMessage, sender: "bot" },
        ]);
      } else {
        console.error("Error:", res.data.message);
      }
    } catch (e) {
      console.error("Error:", e.response?.data || e.message);
    }
  };

  return (
    <AvatarProvider>
      <div className="flex h-screen">
        {!isMainLanding && !isLogin && !isSignUp && <SideBar onOpenChatHistory={handleOpenChatHistory} />}
        {/* <SideBar onOpenChatHistory={handleOpenChatHistory} /> */}
        <div className="flex-1 flex flex-col">
          {!isMainLanding && !isLogin && !isSignUp && <Header />}
          {/* <Header /> */}
          <div className="flex-1 overflow-auto">
            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/" element={<MainLanding />} />
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

              <Route path="/company-management" element={<AdminCompanyManagement />} />
              <Route path="/user-management" element={<AdminUsersManagement />} />
              <Route path="/notification" element={<AdminSMSFacebook />} />
              <Route path="/superadmin" element={<SuperadminManagement />} />
              <Route path="/mainlanding" element={<MainLanding />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />

              <Route path="/upload" element={<UploadFile />} />

              <Route path="/profile" element={<Profile />} />

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
        <ToastContainer />
      </div>
    </AvatarProvider>
  );

}


export default App;