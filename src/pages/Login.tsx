import axios from "axios";
import React, { useState } from "react";
import { FaGoogle, FaGithub, FaMicrosoft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginAuth } from "../services/AuthServices";
import { getUserByUsername } from "../services/UserServices";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Dữ liệu gửi lên:", { username, password });

    try {
      const data = await loginAuth(username, password);
      console.log("Dữ liệu trả về từ server:", data);



      const { access_token } = data;
      localStorage.setItem("userToken", access_token);

      const response = await getUserByUsername(username);
      const decordToken = jwtDecode(access_token);
      console.log("Dữ liệu giải mã từ token:", decordToken);

      localStorage.setItem("userId", decordToken.IdUser);
      localStorage.setItem("userRole", decordToken.Role);
      localStorage.setItem("username", decordToken.sub);
      localStorage.setItem("Permission", decordToken.permissions);

      console.log("ID người dùng:", decordToken.IdUser);
      console.log("Tên người dùng:", decordToken.sub);
      console.log("Quyền người dùng:", decordToken.Role);
      console.log("Quyền truy cập:", decordToken.permissions);

      toast.success("Đăng nhập thành công!");
      if (response.data.Role === "Super Admin") {
        navigate("/home");
      } else if (response.data.Role === "Admin") {
        navigate("/project-management");
      } else {
        navigate("/project-management");
      }
    } catch (error: any) {
      console.error("Lỗi khi đăng nhập:", error);
      console.log("Chi tiết lỗi từ server:", error.response?.data);
      toast.error("Đăng nhập thất bại. Vui lòng thử lại.");
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-6">Đăng nhập tài khoản</h2>

        {/* Social Login Buttons */}
        <div className="space-y-3">
          <button className="flex items-center w-full px-4 py-2 border rounded-md">
            <FaGoogle
              className="mr-2"
              onClick={() => {
                toast.success("Đăng nhập thành công");
                navigate("/home");
              }}
            />{" "}
            Đăng nhập với Google
          </button>
          <button className="flex items-center w-full px-4 py-2 border rounded-md">
            <FaGithub className="mr-2" onClick={() => navigate("/home")} /> Đăng
            nhập với Github
          </button>
          <button className="flex items-center w-full px-4 py-2 border rounded-md">
            <FaMicrosoft className="mr-2" onClick={() => navigate("/home")} />{" "}
            Đăng nhập với Microsoft
          </button>
        </div>

        <div className="my-4 border-t relative">
          <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white px-2 text-gray-500">
            Hoặc
          </span>
        </div>

        {/* Username & Password Login */}
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-left text-sm font-medium">
              Tên người dùng
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)} // Cập nhật state username
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring"
              required
            />
          </div>
          <div>
            <label className="block text-left text-sm font-medium">
              Mật khẩu
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Cập nhật state password
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md"
          >
            Đăng nhập
          </button>
        </form>
        {/* Link to SignUp */}
        <p className="mt-4 text-sm text-gray-500">
          Chưa có tài khoản?{" "}
          <span
            className="text-blue-500 cursor-pointer hover:underline"
            onClick={() => navigate("/signup")}
          >
            Đăng ký ngay
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
