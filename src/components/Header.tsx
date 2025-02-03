import React, { useState } from 'react'
import { useLocation } from 'react-router-dom';
import flower1 from "../assets/image/flower1.png";

import { MdNotifications, MdHelp, MdSettings } from 'react-icons/md';

export default function Header() {

    const [showOptions, setShowOptions] = useState(false);

    const location = useLocation();
    // Xác định tiêu đề trang dựa trên đường dẫn hiện tại

    let pageTitle = "";
    switch (location.pathname) {
        case "/":
            pageTitle = "Trang chủ";
            break;
        case "/chatbot":
            pageTitle = "Chatbot";
            break;
        case "/dashboard":
            pageTitle = "Dashboard";
            break;
        case "/project-management":
            pageTitle = "Project Management";
            break;
        default:
            pageTitle = "404 Not Found";
            break;
    }

    return (
        <div className="bg-white shadow-md p-4 flex justify-between items-center border-b border-gray-300">
            <div className='flex flex-row items-center'>
                {/* Tiêu đề trang */}
                <h1 className="text-xl font-bold">{pageTitle}</h1>
                {/* Nút AI Chat */}
                <button className='bg-slate-700 ml-8 px-4 py-2 rounded-lg text-white hover:bg-slate-500'>AI Chat</button>
            </div>

            <div className="flex flex-row gap-10">
                {/* Nút thông báo */}
                <button className='border rounded-lg border-gray-600 px-3 py-3 '>
                    <MdNotifications size={20} />
                </button>
                {/* Nút cài đặt */}
                <button className='border rounded-lg border-gray-600 px-3 py-3 '>
                    <MdSettings size={20} />
                </button>
                {/* Nút trợ giúp */}
                <button className='border rounded-lg border-gray-600 px-3 py-3 '>
                    <MdHelp size={20} />
                </button>
                {/* Hình đại diện và menu tùy chọn */}
                <div className="relative"
                    onMouseEnter={() => setShowOptions(true)}
                    onMouseLeave={() => setShowOptions(false)}>
                    <img src={flower1} alt="Chatbot" className="w-14 h-14 rounded-full mr-10 cursor-pointer" />
                    {showOptions && (
                        <div className="absolute top-0 w-32 right-5 mt-14 bg-white text-black shadow-lg rounded-lg">
                            <ul>
                                <li className="p-3 hover:bg-gray-100 cursor-pointer">Profile</li>
                                <li className="p-3 hover:bg-gray-100 cursor-pointer">Settings</li>
                                <li className="p-3 hover:bg-gray-100 cursor-pointer">Logout</li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}