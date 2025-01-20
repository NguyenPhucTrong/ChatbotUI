import React from 'react';
import { NavLink } from 'react-router-dom';
import flower2 from "../assets/image/flower2.png";

// Component SideBar
export default function SideBar({ onOpenChatHistory }: { onOpenChatHistory: () => void }) {
    return (
        <div className='w-64 bg-gray-800 text-white h-screen p-4'>
            {/* Logo và liên kết đến trang chủ */}
            <NavLink to="/" className="flex items-center justify-center p-4">
                <img src={flower2} alt="Chatbot" className="w-14 h-14 rounded-full mr-10 cursor-pointer" />
            </NavLink>
            <ul className='space-y-4'>
                {/* Nút mở modal lịch sử chat */}
                <li>
                    <button
                        className="block w-full text-left p-2 rounded hover:bg-gray-700"
                        onClick={onOpenChatHistory}
                    >
                        Lịch sử chat
                    </button>
                </li>
                {/* Liên kết đến trang chủ */}
                <li>
                    <NavLink to="/"
                        className={({ isActive }) => `block p-2 rounded ${isActive ? 'bg-blue-900' : 'hover:bg-gray-700'}`}
                    >
                        Trang chủ
                    </NavLink>
                </li>
                {/* Thêm các liên kết khác ở đây */}
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