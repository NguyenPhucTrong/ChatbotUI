import React, { useState } from 'react'
import { useLocation } from 'react-router-dom';
import flower1 from "../assets/image/flower1.png";

import { MdNotifications, MdHelp, MdSettings } from 'react-icons/md';

export default function Header() {

    const [showOptions, setShowOptions] = useState(false);

    const location = useLocation();

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
        default:
            pageTitle = "404 Not Found";
            break;
    }

    return (
        <div className=" bg-white shadow-md p-4 flex justify-between items-center border-b border-gray-300 ">
            <div className='flex flex-row items-center'>
                <h1 className="text-xl font-bold">{pageTitle}</h1>

                <button className='bg-slate-700 px-4 py-2 rounded-sm text-white'>AI Chat</button>
            </div>


            <div className="flex flex-row gap-10">

                <button className='border rounded border-gray-600 px-6 py-3 '>
                    <MdNotifications size={25} />
                </button>

                <button className='border rounded border-gray-600 px-6 py-3 '>
                    <MdSettings size={25} />
                </button>

                <button className='border rounded border-gray-600 px-6 py-3 '>
                    <MdHelp size={25} />
                </button>

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
    )
}
