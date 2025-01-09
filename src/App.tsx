import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import CreateUser from "./pages/CreateUser";
import EditUser from "./pages/EditUser";
import Setting from "./pages/Setting";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/create-user" element={<CreateUser />} />
        <Route path="/setting" element={<Setting />} />
        <Route path="/edit-user/:id" element={<EditUser />} />
      </Routes>
    </Router>
  );
}
