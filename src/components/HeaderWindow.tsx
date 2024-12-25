import flower1 from "../assets/image/flower1.png";
import { useState } from "react";

interface HeaderWindowProps {
    onNewChat: () => void;
}

export default function HeaderWindow({ onNewChat }: HeaderWindowProps) {
    const [showOptions, setShowOptions] = useState(false);

    return (
        <div className=" flex flex-row-reverse p-4 bg-gray-300 text-white flex justify-between items-center"

        >
            <div className="relative"

                onMouseEnter={() => setShowOptions(true)}
                onMouseLeave={() => setShowOptions(false)}>

                <img src={flower1} alt="Zoe" className="w-10 h-10 rounded-full mr-10" />
                {showOptions && (
                    <div className="absolute top-0 w-32 right-5 mt-11 bg-white text-black shadow-lg rounded-lg">
                        <ul>
                            <li className="p-2 hover:bg-gray-100 cursor-pointer">Profile</li>
                            <li className="p-2 hover:bg-gray-100 cursor-pointer">Settings</li>
                            <li className="p-2 hover:bg-gray-100 cursor-pointer">Logout</li>
                        </ul>
                    </div>
                )}
            </div>

            <div>
                <button onClick={onNewChat} className="px-4 py-2 bg-white text-black rounded-lg shadow-lg hover:bg-gray-100 ">
                    New Chat
                </button>
            </div>

        </div>
    )
}
