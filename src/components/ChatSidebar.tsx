import flower1 from "../assets/image/geng.png";

const users = [
    { name: "Lilly", status: "Always on holidays", online: false, img: flower1 },
    { name: "Zoe", status: "Great! Good luck with your new...", online: true, img: flower1 },
    { name: "Joe", status: "Sleeping", online: false, img: flower1 },
    { name: "Emily", status: "Are you there?", online: true, unread: 3, img: flower1 },
    { name: "Akane", status: "When can we meet?", online: false, img: flower1 },
    { name: "Eliot", status: "Nice", online: false, img: flower1 },
    { name: "Patrik", status: "Be back...", online: false, img: flower1 },
];

function ChatSidebar() {
    return (
        <div className="w-[350px] bg-gray-100 border-r border-gray-300">
            {/* Search */}
            <div className="p-4">
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full p-2 border border-gray-300 rounded-lg"
                />
            </div>
            {/* Messages */}
            <ul>
                {users.map((user, index) => (
                    <li key={index} className="p-4 flex items-center border-b border-gray-200">
                        {user.img && (
                            <img src={user.img} alt={user.name} className="w-10 h-10 rounded-full" />
                        )}
                        <div className="ml-4 flex-1">
                            <h1 className="text-lg text-black ">{user.status}</h1>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ChatSidebar;