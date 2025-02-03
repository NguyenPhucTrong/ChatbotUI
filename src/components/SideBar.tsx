import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import flower2 from "../assets/image/flower2.png";
import { AiFillHome } from 'react-icons/ai';
import { FaBars, FaHistory, FaProjectDiagram } from 'react-icons/fa';
import { MdMenu, MdClose, MdDashboard, MdLogout } from 'react-icons/md';

export default function SideBar({ onOpenChatHistory }: { onOpenChatHistory: () => void }) {
    const [isOpen, setIsOpen] = useState(true);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`flex flex-col ${isOpen ? 'w-72' : 'w-16'} bg-gray-800 text-white h-screen transition-width duration-300`}>
            <button onClick={toggleSidebar} className="p-4">
                {isOpen ? <FaBars className="w-6 h-6" /> : <MdMenu className="w-6 h-6" />}
            </button>
            {isOpen && (
                <>
                    <NavLink to="/" className="flex flex-row items-center justify-center gap-5 p-5">
                        <img src={flower2} alt="Chatbot" className="w-16 h-16 rounded-full cursor-pointer" />
                        <h1 className='text-2xl font-bold'>Chatbot</h1>
                    </NavLink>
                    <br />
                    <ul className='space-y-6'>
                        <li>
                            <button
                                className="flex flex-row w-full text-left p-3 pl-5 rounded hover:bg-gray-700"
                                onClick={onOpenChatHistory}
                            >
                                <FaHistory className="w-6 h-6 mr-2" />
                                <h1 className='text-lg font-light'>History chat</h1>
                            </button>
                        </li>
                        <li>
                            <NavLink to="/"
                                className={({ isActive }) => `flex flex-row items-center p-3 pl-5 rounded ${isActive ? 'bg-blue-900' : 'hover:bg-gray-700'}`}
                            >
                                <AiFillHome className="w-6 h-6 mr-2" />
                                <h1 className='text-lg font-light'>Home</h1>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/project-management"
                                className={({ isActive }) => `flex flex-row items-center p-3 pl-5 rounded ${isActive ? 'bg-blue-900' : 'hover:bg-gray-700'}`}
                            >
                                <FaProjectDiagram className="w-6 h-6 mr-2" />
                                <h1 className='text-lg font-light'>Project Management</h1>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/dashboard"
                                className={({ isActive }) => `flex flex-row items-center p-3 pl-5 rounded ${isActive ? 'bg-blue-900' : 'hover:bg-gray-700'}`}
                            >
                                <MdDashboard className="w-6 h-6 mr-2" />
                                <h1 className='text-lg font-light'>Dashboard</h1>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="#"
                                className={({ isActive }) => `flex flex-row items-center p-3 pl-5 rounded ${isActive ? 'bg-blue-900' : 'hover:bg-gray-700'}`}
                            >
                                <MdLogout className="w-6 h-6 mr-2" />
                                <h1 className='text-lg font-light'>Logout</h1>
                            </NavLink>
                        </li>
                    </ul>
                </>
            )}
        </div>
    );
}