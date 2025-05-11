import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import flower2 from "../assets/image/flower2.png";
import { AiFillHome } from "react-icons/ai";
import {
  FaBars,
  FaHistory,
  FaProjectDiagram,
  FaRobot,
  FaBuilding,
  FaUsers,
  FaBell,
  FaUserShield,
  FaKey,
} from "react-icons/fa";
import { MdMenu, MdDashboard, MdLogout, MdUploadFile } from "react-icons/md";
import { getUserByUsername } from "../services/UserServices";

export default function SideBar({
  onOpenChatHistory,
}: {
  onOpenChatHistory: () => void;
}) {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const [permissionsList, setPermissionsList] = useState<string[]>([]);


  useEffect(() => {
    const fetchPermissionsList = async () => {
      const permissions = localStorage.getItem('Permission');
      setPermissionsList(permissions ? permissions.split(',') : []);
    };

    fetchPermissionsList();
  }, []);


  const [role, setRole] = useState("");

  useEffect(() => {
    fetchUser();
    async function fetchUser() {
      const username = localStorage.getItem("username") || "";
      const response = await getUserByUsername(username);
      setRole(response.data.Role);
    }
  }, []);
  return (
    <div className="flex h-screen overflow-auto bg-gray-800">
      <div
        className={`flex flex-col max-w-[288px] mx-auto  text-white h-screen transition-all duration-300 ${isOpen ? "w-72" : "w-16"
          } `}
      >
        <button onClick={toggleSidebar} className="p-4">
          {isOpen ? (
            <FaBars className="w-6 h-6" />
          ) : (
            <MdMenu className="w-6 h-6" />
          )}
        </button>
        {isOpen && (
          <>
            <NavLink
              to="/"
              className="flex flex-row items-center justify-center gap-5 p-5"
            >
              <img
                src={flower2}
                alt="Chatbot"
                className="w-16 h-16 rounded-full cursor-pointer"
              />
              <h1 className="text-2xl font-bold">Chatbot</h1>
            </NavLink>
            <br />
            <ul className="space-y-6">
              {role === "Super Admin" ? (
                <>
                  <li>
                    <NavLink
                      to="/superadmin"
                      className={({ isActive }) =>
                        `flex flex-row items-center p-3 pl-5 rounded ${isActive ? "bg-blue-900" : "hover:bg-gray-700"
                        }`
                      }
                    >
                      <FaUserShield className="w-6 h-6 mr-2" />
                      <h1 className="text-lg font-light">Super Admin</h1>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/home"
                      className={({ isActive }) =>
                        `flex flex-row items-center p-3 pl-5 rounded ${isActive ? "bg-blue-900" : "hover:bg-gray-700"
                        }`
                      }
                    >
                      <AiFillHome className="w-6 h-6 mr-2" />
                      <h1 className="text-lg font-light">Home</h1>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/permissions"
                      className={({ isActive }) =>
                        `flex flex-row items-center p-3 pl-5 rounded ${isActive ? "bg-blue-900" : "hover:bg-gray-700"
                        }`
                      }
                    >
                      <FaKey className="w-6 h-6 mr-2" />
                      <h1 className="text-lg font-light">Permission</h1>
                    </NavLink>
                  </li>
                </>
              ) : (
                <span></span>
              )}
              {role === "Admin" ? (
                <>
                  <li>
                    <NavLink
                      to="/upload"
                      className={({ isActive }) =>
                        `flex flex-row items-center p-3 pl-5 rounded ${isActive ? "bg-blue-900" : "hover:bg-gray-700"
                        }`
                      }
                    >
                      <MdUploadFile className="w-6 h-6 mr-2" />
                      <h1 className="text-lg font-light">UploadFile</h1>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/user-management"
                      className={({ isActive }) =>
                        `flex flex-row items-center p-3 pl-5 rounded ${isActive ? "bg-blue-900" : "hover:bg-gray-700"
                        }`
                      }
                    >
                      <FaUsers className="w-6 h-6 mr-2" />
                      <h1 className="text-lg font-light">User Management</h1>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/notification"
                      className={({ isActive }) =>
                        `flex flex-row items-center p-3 pl-5 rounded ${isActive ? "bg-blue-900" : "hover:bg-gray-700"
                        }`
                      }
                    >
                      <FaBell className="w-6 h-6 mr-2" />
                      <h1 className="text-lg font-light">Notification</h1>
                    </NavLink>
                  </li>
                  {permissionsList.includes("GET: Projects") ? (
                    <li>
                      <NavLink
                        to="/project-management"
                        className={({ isActive }) =>
                          `flex flex-row items-center p-3 pl-5 rounded ${isActive ? "bg-blue-900" : "hover:bg-gray-700"}`
                        }
                      >
                        <FaProjectDiagram className="w-6 h-6 mr-2" />
                        <h1 className="text-lg font-light">Project Management</h1>
                      </NavLink>
                    </li>
                  ) : (
                    <li>No Permission</li>
                  )}
                  <li>
                    <NavLink
                      to="/project-members"
                      className={({ isActive }) =>
                        `flex flex-row items-center p-3 pl-5 rounded ${isActive ? "bg-blue-900" : "hover:bg-gray-700"
                        }`
                      }
                    >
                      <FaProjectDiagram className="w-6 h-6 mr-2" />
                      <h1 className="text-lg font-light">Project Member</h1>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/dashboard"
                      className={({ isActive }) =>
                        `flex flex-row items-center p-3 pl-5 rounded ${isActive ? "bg-blue-900" : "hover:bg-gray-700"
                        }`
                      }
                    >
                      <MdDashboard className="w-6 h-6 mr-2" />
                      <h1 className="text-lg font-light">Dashboard</h1>
                    </NavLink>
                  </li>
                </>
              ) : (
                <span></span>
              )}

              {role === "User" ? (
                <>
                  <li>
                    <button
                      className="flex flex-row w-full text-left p-3 pl-5 rounded hover:bg-gray-700"
                      onClick={onOpenChatHistory}
                    >
                      <FaHistory className="w-6 h-6 mr-2" />
                      <h1 className="text-lg font-light">History chat</h1>
                    </button>
                  </li>

                  <li>
                    <NavLink
                      to="/project-management"
                      className={({ isActive }) =>
                        `flex flex-row items-center p-3 pl-5 rounded ${isActive ? "bg-blue-900" : "hover:bg-gray-700"
                        }`
                      }
                    >
                      <FaProjectDiagram className="w-6 h-6 mr-2" />
                      <h1 className="text-lg font-light">My Projects</h1>
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      to="/chatbot"
                      className={({ isActive }) =>
                        `flex flex-row items-center p-3 pl-5 rounded ${isActive ? "bg-blue-900" : "hover:bg-gray-700"
                        }`
                      }
                    >
                      <FaRobot className="w-6 h-6 mr-2" />
                      <h1 className="text-lg font-light">ChatBot Q&A</h1>
                    </NavLink>
                  </li>

                </>
              ) : (
                <span></span>
              )}
              {/* <li>
                <NavLink
                  to="/company-management"
                  className={({ isActive }) =>
                    `flex flex-row items-center p-3 pl-5 rounded ${
                      isActive ? "bg-blue-900" : "hover:bg-gray-700"
                    }`
                  }
                >
                  <FaBuilding className="w-6 h-6 mr-2" />
                  <h1 className="text-lg font-light">Company Management</h1>
                </NavLink>
              </li> */}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}