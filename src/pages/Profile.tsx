import React, { useState, useEffect } from 'react';
import { getUserById, updateUser,getUserByUsername } from '../services/UserServices';
import Flower1 from '../assets/image/flower1.png';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

export default function Profile() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState('');
    const [fullname, setFullname] = useState('');
    const [department, setDepartment] = useState('');
    const [idUser, setIdUser] = useState<number | null>(null);
    // const [userId] = useState(1); // Tạm thời cố định userId là 1 (có thể thay đổi theo logic của bạn)


    const token = localStorage.getItem('userToken');
    const currentUsername = localStorage.getItem("username") || "";
    if (!token) {
        toast.error('Vui lòng đăng nhập để truy cập trang này.');
        return <Navigate to="/" />;
    }

    // Lấy thông tin user khi component được mount
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await getUserByUsername(currentUsername);
            
                const user = response.data;
                console.log('Thông tin user:', response.data);

                // Gán dữ liệu từ API vào state, đảm bảo giá trị không bị undefined
                setIdUser(user.IdUser);
                setName(user.Username || ''); // Sử dụng `|| ''` để tránh undefined
                setEmail(user.Email || '');
                setPhone(user.PhoneNumber || '');
                setRole(user.Role || '');
                setDepartment(user.Department || '');
                setFullname(user.Fullname || '');
            } catch (error) {
                console.error('Lỗi khi lấy thông tin user:', error);
                toast.error('Không thể lấy thông tin user. Vui lòng thử lại.');
            }
        };

        fetchUser();
    }, []);

    // Hàm lưu thông tin user
    const handleSave = async () => {
        if (!idUser) {
            toast.error('Không tìm thấy ID người dùng. Vui lòng thử lại.');
            return;
        }
    
        try {
            const payload: any = {};
    
            // Chỉ thêm các trường đã thay đổi vào payload
            if (name.trim() !== '') payload.Username = name.trim();
            if (fullname.trim() !== '') payload.Fullname = fullname.trim();
            if (email.trim() !== '') payload.Email = email.trim();
            if (phone.trim() !== '') payload.PhoneNumber = phone.trim();
            if (role.trim() !== '') payload.Role = role.trim();
    
            // Thêm các giá trị mặc định nếu cần
            payload.Password = 'default_password'; // Giá trị mặc định
            payload.Permission = 'default_permission'; // Giá trị mặc định
    
            console.log('Dữ liệu gửi lên API:', payload);
    
            // Gửi yêu cầu cập nhật thông tin người dùng
            await updateUser(idUser, payload);
    
            // Gọi lại API để cập nhật thông tin hiển thị
            const response = await getUserById(idUser);
            const user = response.data;
    
            // Cập nhật lại state với dữ liệu mới
            setName(user.Username || '');
            setEmail(user.Email || '');
            setPhone(user.PhoneNumber || '');
            setRole(user.Role || '');
            setDepartment(user.Department || '');
            setFullname(user.Fullname || '');
    
            // Hiển thị thông báo thành công
            toast.success('Thông tin đã được lưu thành công!');
        } catch (error: any) {
            console.error('Lỗi khi lưu thông tin user:', error);
    
            // Xử lý lỗi từ API
            if (error.response?.data?.detail) {
                toast.error(`Lỗi từ API: ${error.response.data.detail}`);
            } else {
                toast.error('Lỗi không xác định. Vui lòng thử lại.');
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 w-full max-w-3xl bg-white shadow-lg rounded-lg">
                {/* Tiêu đề */}
                <h1 className="text-3xl font-bold text-center mb-6">Thông tin cá nhân</h1>

                {/* Hình + tên */}
                <div className="flex flex-row items-center justify-center text-center mb-6 space-x-6">
                    <div className="flex flex-col items-center">
                        <img src={Flower1} alt="Avatar" className="w-24 h-24 rounded-full shadow-md" />
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="text-2xl font-bold mt-2 text-center border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Thông tin cá nhân */}
                <div className="flex flex-row justify-between text-left gap-x-8 mb-6">
                    {/* Cột 1: Fullname + Phone */}
                    <div className="flex-1 ">
                        <p className="text-gray-600 my-5">
                            <span className="font-semibold">Fullname:</span>
                            <input
                                type="email"
                                value={fullname}
                                onChange={(e) => setFullname(e.target.value)}
                                className="ml-2 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                            />
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

                {/* Nút chỉnh sửa */}
                <div className="flex justify-center mt-6">
                    <button
                        onClick={handleSave}
                        className="bg-blue-500 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}