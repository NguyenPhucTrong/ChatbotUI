import React, { useState, useEffect } from "react";
import {
    getUserById,
    updateUser,
    getUserByUsername,
} from "../services/UserServices";
import Flower1 from "../assets/image/flower1.png";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import AvatarUploader from "../components/AvatarUploader";
import { useAvatar } from "../components/AvatarContext";

export default function Profile() {
    const { avatar, setAvatar } = useAvatar(); // Lấy và cập nhật avatar từ context
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [role, setRole] = useState("");
    const [fullname, setFullname] = useState("");
    const [department, setDepartment] = useState("");
    const [idUser, setIdUser] = useState<number | null>(null);

    const token = localStorage.getItem("userToken");
    const currentUsername = localStorage.getItem("username") || "";
    if (!token) {
        toast.error("Vui lòng đăng nhập để truy cập trang này.");
        return <Navigate to="/" />;
    }

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await getUserByUsername(currentUsername);
                const user = response.data;

                setIdUser(user.IdUser);
                setName(user.Username || "");
                setEmail(user.Email || "");
                setPhone(user.PhoneNumber || "");
                setRole(user.Role || "");
                setDepartment(user.Department || "");
                setFullname(user.Fullname || "");
                setAvatar(user.Avatar || Flower1);
            } catch (error) {
                console.error("Lỗi khi lấy thông tin user:", error);
                toast.error("Không thể lấy thông tin user. Vui lòng thử lại.");
            }
        };

        fetchUser();
    }, []);

    const handleAvatarUpdate = (newAvatar: string) => {
        setAvatar(newAvatar); // Cập nhật avatar trong state
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 w-full max-w-3xl bg-white shadow-lg rounded-lg">
                <h1 className="text-3xl font-bold text-center mb-6">
                    Thông tin cá nhân
                </h1>

                {/* Avatar Uploader */}
                <div className="flex flex-row items-center justify-center text-center mb-6 space-x-6">
                    <AvatarUploader avatar={avatar || Flower1} onAvatarChange={handleAvatarUpdate} />
                </div>

                {/* Thông tin cá nhân */}
                <div className="flex flex-row justify-between text-left gap-x-8 mb-6">
                    {/* Cột 1: Fullname + Phone */}
                    <div className="flex-1 ">
                        <p className="text-gray-600 my-5">
                            <span className="font-semibold">Username:</span>
                            <span> {fullname}</span>
                        </p>
                        <p className="text-gray-600 my-5">
                            <span className="font-semibold">Phone:</span>
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="ml-2 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                            />
                        </p>
                    </div>
                    {/* Cột 2: Email + Role */}
                    <div className="flex-1">
                        <p className="text-gray-600 my-5">
                            <span className="font-semibold">Email:</span>
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="ml-2 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                            />
                        </p>
                        <p className="text-gray-600 my-5">
                            <span className="font-semibold">Role:</span>
                            <input
                                type="text"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="ml-2 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                            />
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
