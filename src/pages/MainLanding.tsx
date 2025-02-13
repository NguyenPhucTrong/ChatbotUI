import React from "react";
import { FaRobot, FaTasks, FaChartBar } from "react-icons/fa";

const MainLandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-white">
      {/* Header */}
      <header className="w-full flex justify-between items-center p-6 border-b">
        <h1 className="text-xl font-bold">LOGO</h1>
        <div>
          <button className="mr-2 px-4 py-2 border border-black text-black bg-white hover:bg-gray-100 rounded">Đăng nhập</button>
          <button className="px-4 py-2 bg-black text-white hover:bg-gray-800 rounded">Đăng ký</button>
        </div>
      </header>

      {/* Main Content */}
      <main className="text-center max-w-3xl mt-16">
        <h2 className="text-4xl font-bold leading-tight">
          Quản lý dự án thông minh <br /> với trợ lý AI
        </h2>
        <p className="mt-4 text-gray-600">
          Nền tảng quản lý dự án tích hợp AI giúp đọc, tóm tắt và phân tích tài liệu.
          Tối ưu hóa quy trình làm việc của team của bạn.
        </p>
        <button className="mt-6 px-6 py-3 text-lg bg-black text-white hover:bg-gray-800 rounded">Dùng thử miễn phí</button>
      </main>

      {/* Features Section */}
      <section className="mt-16 w-full px-6 max-w-5xl text-center">
        <h3 className="text-2xl font-semibold">Giải pháp toàn diện cho team của bạn</h3>
        <div className="flex justify-center mt-8 space-x-6">
          <div className="flex flex-col items-center max-w-xs">
            <FaRobot className="text-4xl bg-black text-white p-2 rounded-md" />
            <h4 className="font-semibold mt-4">Bot AI thông minh</h4>
            <p className="text-gray-600 text-sm mt-2">
              Tự động đọc và tóm tắt tài liệu dự án, trả lời câu hỏi và đề xuất giải pháp.
            </p>
          </div>
          <div className="flex flex-col items-center max-w-xs">
            <FaTasks className="text-4xl bg-black text-white p-2 rounded-md" />
            <h4 className="font-semibold mt-4">Quản lý dự án</h4>
            <p className="text-gray-600 text-sm mt-2">
              Theo dõi tiến độ, phân công công việc và quản lý tài nguyên hiệu quả.
            </p>
          </div>
          <div className="flex flex-col items-center max-w-xs">
            <FaChartBar className="text-4xl bg-black text-white p-2 rounded-md" />
            <h4 className="font-semibold mt-4">Phân tích & Báo cáo</h4>
            <p className="text-gray-600 text-sm mt-2">
              Tạo báo cáo tự động, phân tích dữ liệu và đưa ra insights cho dự án.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-16 w-full py-6 border-t text-center text-gray-500 text-sm">
        <p>&copy; 2024 Project AI. Bản quyền thuộc về công ty.</p>
      </footer> 
    </div>
  );
};

export default MainLandingPage;
