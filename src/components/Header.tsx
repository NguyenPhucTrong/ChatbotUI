import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import flower1 from "../assets/image/flower1.png";

import { MdNotifications, MdHelp, MdSettings, MdSearch } from 'react-icons/md';

export default function Header() {

    const [showOptions, setShowOptions] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

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
        case "/profile":
            pageTitle = "Profile";
            break;
        default:
            pageTitle = "404 Not Found";
            break;
    }

    // const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setSearchQuery(e.target.value);
    //     // onSearch(e.target.value);
    //     console.log(e.target.value);
    // }

    return (
        <div className="w-full bg-gray-100">
            <div className="bg-white shadow-md max-w-[1632px] mx-auto p-4 flex justify-between items-center border-b border-gray-300">
                <div className='flex flex-row items-center'>
                    {/* Tiêu đề trang */}
                    <h1 className="text-xl font-bold">{pageTitle}</h1>
                    {/* Nút AI Chat */}
                    <button className='bg-slate-700 ml-8 px-4 py-2 rounded-lg text-white hover:bg-slate-500'>AI Chat</button>
                </div>
                <div className='relative'>
                    <input
                        type="text"
                        placeholder='Search...'
                        value={searchQuery}
                        onChange={(e) => {
                            console.log(e.target.value)
                            setSearchQuery(e.target.value)
                        }}
                        className=' w-96 p-2 pl-10 border rounded-lg border-gray-300'
                    />
                    <MdSearch size={25} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
                </div>

                <div className="flex flex-row gap-10">
                    <div className=' rounded-lg  px-3 py-3 flex justify-between w-44'>

                        {/* Nút thông báo */}
                        <button >
                            <MdNotifications size={24} />
                        </button>
                        {/* Nút cài đặt */}
                        <button >
                            <MdSettings size={24} />
                        </button>
                        {/* Nút trợ giúp */}
                        <button >
                            <MdHelp size={24} />
                        </button>
                    </div>
                    {/* Hình đại diện và menu tùy chọn */}
                    <div className="relative"
                        onMouseEnter={() => setShowOptions(true)}
                        onMouseLeave={() => setShowOptions(false)}>
                        <img src={flower1} alt="Chatbot" className="w-14 h-14 rounded-full mr-10 cursor-pointer" />
                        {showOptions && (
                            <div className="absolute top-0 w-32 right-5 mt-14 bg-white text-black shadow-lg rounded-lg">
                                <ul>
                                    <li className="p-3 hover:bg-gray-100 cursor-pointer">
                                        <Link to="/profile" >Profile</Link>
                                    </li>
                                    <li className="p-3 hover:bg-gray-100 cursor-pointer">Settings</li>
                                    <li className="p-3 hover:bg-gray-100 cursor-pointer">Logout</li>
                                </ul>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}