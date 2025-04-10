import React from "react";
import { FaGoogle, FaGithub, FaMicrosoft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-6">Đăng nhập tài khoản</h2>

        {/* Social Login Buttons */}
        <div className="space-y-3">
          <button className="flex items-center w-full px-4 py-2 border rounded-md">
            <FaGoogle className="mr-2" onClick={() => { toast.success("Đăng nhập thành công"); navigate("/home") }} /> Đăng nhập với Google
          </button>
          <button className="flex items-center w-full px-4 py-2 border rounded-md">
            <FaGithub className="mr-2" onClick={() => navigate("/home")} /> Đăng nhập với Github
          </button>
          <button className="flex items-center w-full px-4 py-2 border rounded-md">
            <FaMicrosoft className="mr-2" onClick={() => navigate("/home")} /> Đăng nhập với Microsoft
          </button>
        </div>

        <div className="my-4 border-t relative">
          <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white px-2 text-gray-500">Hoặc</span>
        </div>

        {/* Email & Password Login */}
        <form className="space-y-4">
          <div>
            <label className="block text-left text-sm font-medium">Email</label>
            <input type="email" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring" />
          </div>
          <div>
            <label className="block text-left text-sm font-medium">Mật khẩu</label>
            <input type="password" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring" />
          </div>
          <button className="w-full bg-black text-white py-2 rounded-md" onClick={() => { toast.success("Đăng nhập thành công"); navigate("/home") }}>Đăng nhập</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
