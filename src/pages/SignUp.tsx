import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createUser } from '../services/UserServices';

export default function SignUp() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [passwordError, setPasswordError] = useState(''); // Lưu lỗi mật khẩu không khớp

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();

        // Kiểm tra dữ liệu đầu vào
        if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
            toast.error('Vui lòng điền đầy đủ thông tin.');
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Mật khẩu nhập lại không khớp.');
            return;
        }

        try {
            const newUser = {
                username: username.trim(),
                password: password.trim(),
                role: 'user',
                permission: 'none',
            };

            console.log('Dữ liệu gửi lên API:', newUser);

            await createUser(newUser);
            toast.success('Đăng ký thành công!');
            navigate('/login');
        } catch (error: any) {
            console.error('Lỗi khi đăng ký:', error);

            if (error.response?.data?.detail) {
                toast.error(`Lỗi: ${error.response.data.detail}`);
            } else {
                toast.error('Đăng ký thất bại. Vui lòng thử lại.');
            }
        }
    };

    // Kiểm tra mật khẩu nhập lại
    const handleConfirmPasswordChange = (value: string) => {
        setConfirmPassword(value);
        if (value !== password) {
            setPasswordError('Mật khẩu nhập lại không khớp.');
        } else {
            setPasswordError('');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
                <h2 className="text-2xl font-bold mb-6">Đăng ký tài khoản</h2>

                <form className="space-y-4" onSubmit={handleSignUp}>
                    <div>
                        <label className="block text-left text-sm font-medium">Tên người dùng</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-left text-sm font-medium">Mật khẩu</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-2 top-2 text-sm text-gray-500"
                            >
                                {showPassword ? 'Ẩn' : 'Hiển thị'}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-left text-sm font-medium">Nhập lại mật khẩu</label>
                        <div className="relative">
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring ${
                                    passwordError ? 'border-red-500' : ''
                                }`}
                                required
                            />
                            {passwordError && (
                                <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                            )}
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-black text-white py-2 rounded-md"
                        disabled={!!passwordError} // Vô hiệu hóa nút nếu có lỗi
                    >
                        Đăng ký
                    </button>
                </form>

                <p className="mt-4 text-sm text-gray-500">
                    Đã có tài khoản?{' '}
                    <span
                        className="text-blue-500 cursor-pointer hover:underline"
                        onClick={() => navigate('/login')}
                    >
                        Đăng nhập
                    </span>
                </p>
            </div>
        </div>
    );
}