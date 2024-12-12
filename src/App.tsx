import ChatWindow from "./components/ChatWindow";
import ChatSidebar from "./components/ChatSidebar";

function App() {
  return (
    <div className="flex h-screen">
      <ChatSidebar />
      <ChatWindow />
    </div>
  );
}

export default App;