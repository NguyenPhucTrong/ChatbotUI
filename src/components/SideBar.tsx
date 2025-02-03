import React from 'react';
import { NavLink } from 'react-router-dom';
import flower2 from "../assets/image/flower2.png";
import { AiFillHome } from 'react-icons/ai';
import { FaHistory, FaProjectDiagram } from 'react-icons/fa';

// Component SideBar
export default function SideBar({ onOpenChatHistory }: { onOpenChatHistory: () => void }) {
    return (
        <div className='w-64 bg-gray-800 text-white h-screen p-5'>
            {/* Logo và liên kết đến trang chủ */}
            <NavLink to="/" className="flex flex-row items-center justify-center gap-5 p-5">
                <img src={flower2} alt="Chatbot" className="w-16 h-16 rounded-full cursor-pointer" />
                <h1 className='text-2xl font-bold'>
                    Chatbot
                </h1>
            </NavLink>
            <ul className='space-y-4 '>
                {/* Nút mở modal lịch sử chat */}
                <li>
                    <button
                        className="flex flex-row w-full text-left p-2 rounded hover:bg-gray-700"
                        onClick={onOpenChatHistory}
                    >
                        <FaHistory className="w-6 h-6 mr-2" />
                        <h1 className='text-lg font-light'>
                            History chat
                        </h1>
                    </button>
                </li>
                {/* Liên kết đến trang chủ */}
                <li>
                    <NavLink to="/"
                        className={({ isActive }) => ` flex flex-row items-center p-2 rounded ${isActive ? 'bg-blue-900' : 'hover:bg-gray-700'}`}
                    >
                        <AiFillHome className="w-6 h-6 mr-2" />
                        <h1 className='text-lg font-light'>
                            Home
                        </h1>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/project-management"
                        className={({ isActive }) => `flex flex-row items-center p-2 rounded ${isActive ? 'bg-blue-900' : 'hover:bg-gray-700'}`}
                    >
                        <FaProjectDiagram className="w-6 h-6 mr-2" />
                        <h1 className='text-lg font-light'>
                            Project Management
                        </h1>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/chatbot"
                        className={({ isActive }) => `block p-2 rounded ${isActive ? 'bg-blue-900' : 'hover:bg-gray-700'}`}
                    >
                        ChatBot Q&A
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/dashboard"
                        className={({ isActive }) => `block p-2 rounded ${isActive ? 'bg-blue-900' : 'hover:bg-gray-700'}`}
                    >
                        Dashboard
                    </NavLink>
                </li>
            </ul>
        </div>
    );
}