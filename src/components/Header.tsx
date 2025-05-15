import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import flower1 from "../assets/image/flower1.png";
import { MdNotifications, MdHelp, MdSettings, MdSearch } from "react-icons/md";
import { toast } from "react-toastify";
import { useAvatar } from "./AvatarContext";
import { getProjectById } from "../services/ProjectsServices"; // Import API service

export default function Header() {
  const { avatar } = useAvatar();
  const [showOptions, setShowOptions] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showChatbot, setShowChatbot] = useState(false);
  const [pageTitle, setPageTitle] = useState("Loading...");

  const location = useLocation();
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>(); // Get projectId if available

  useEffect(() => {
    // Xác định tiêu đề trang dựa trên đường dẫn hiện tại
    const fetchProjectName = async () => {
      if (projectId) {
        try {
          const response = await getProjectById(Number(projectId));
          const projectName = response.data.ProjectName;
          setPageTitle(`Project Detail: ${projectName}`);
        } catch (error) {
          console.error("Error fetching project details:", error);
          setPageTitle("Project Detail");
        }
      } else {
        setPageTitle("Project Detail");
      }
    };

    if (location.pathname.startsWith("/project-detail/")) {
      fetchProjectName();
    } else {
      switch (location.pathname) {
        case "/home":
          setPageTitle("Trang chủ");
          break;
        case "/chatbot":
          setPageTitle("Chatbot");
          break;
        case "/dashboard":
          setPageTitle("Dashboard");
          break;
        case "/project-management":
          setPageTitle("Project Management");
          break;
        case "/company-management":
        case "/user-management":
          setPageTitle("Admin");
          break;
        case "/notification":
          setPageTitle("Notification");
          break;
        case "/superadmin":
          setPageTitle("Superadmin");
          break;
        case "/profile":
          setPageTitle("Profile");
          break;
        case "/upload":
          setPageTitle("UploadFile");
          break;
        case "/permissions":
          setPageTitle("Permissions");
          break;
        case "/project-members":
          setPageTitle("Project-Members");
          break;
        case "/user-project-management":
          setPageTitle("User Project Management");
          break;
        default:
          setPageTitle("404 Not Found");
          break;
      }
    }
  }, [location.pathname, projectId]);

  return (
    <div className="w-full bg-gray-100">
      <div className="bg-white shadow-md w-full mx-auto p-4 flex justify-between items-center border-b border-gray-300">
        <div className="flex flex-row items-center">
          <h1 className="text-xl font-bold">{pageTitle}</h1>
          <button
            className="bg-slate-700 ml-8 px-4 py-2 rounded-lg text-white hover:bg-slate-500"
            onClick={() => setShowChatbot(!showChatbot)}
          >
            AI Chat
          </button>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className=" w-96 p-2 pl-10 border rounded-lg border-gray-300"
          />
          <MdSearch
            size={25}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500"
          />
        </div>

        <div className="flex flex-row gap-10">
          <div className=" rounded-lg px-3 py-3 flex justify-between w-44">
            <button>
              <MdNotifications size={24} />
            </button>
            <button>
              <MdSettings size={24} />
            </button>
            <button>
              <MdHelp size={24} />
            </button>
          </div>

          <div
            className="relative"
            onMouseEnter={() => setShowOptions(true)}
            onMouseLeave={() => setShowOptions(false)}
          >
            <img
              src={avatar || flower1}
              alt="Chatbot"
              className="w-14 h-14 rounded-full mr-10 cursor-pointer"
            />
            {showOptions && (
              <div className="absolute top-0 w-32 right-5 mt-14 bg-white text-black shadow-lg rounded-lg">
                <ul>
                  <li className="p-3 hover:bg-gray-100 cursor-pointer">
                    <Link to="/profile">Profile</Link>
                  </li>
                  <li className="p-3 hover:bg-gray-100 cursor-pointer">
                    Settings
                  </li>
                  <li
                    className="p-3 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      localStorage.clear();
                      toast.success("Đăng xuất thành công");
                      navigate("/login");
                    }}
                  >
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      {showChatbot && (
        <div className="fixed bottom-4 right-4 w-96 h-96 bg-white shadow-lg border rounded-lg p-4">
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-lg font-bold">AI Chat Assistant</h2>
            <button
              onClick={() => setShowChatbot(false)}
              className="text-red-500"
            >
              ✖
            </button>
          </div>
          <div className="mt-4 h-64 overflow-auto">
            <p>Xin chào! Tôi là trợ lý AI. Tôi có thể giúp gì cho bạn?</p>
          </div>
          <input
            type="text"
            placeholder="Nhập tin nhắn..."
            className="w-full p-2 border rounded-lg mt-2"
          />
        </div>
      )}
    </div>
  );
}
