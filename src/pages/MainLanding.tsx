import React from "react";
import { FaRobot, FaTasks, FaChartBar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const MainLandingPage = () => {

  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center bg-white">
      {/* Header */}
      <header className="w-full flex justify-between items-center p-6 border-b">
        <h1 className="text-xl font-bold">LOGO</h1>
        <div>
          <button className="mr-2 px-4 py-2 border border-black text-black bg-white hover:bg-gray-100 rounded"
            onClick={() => navigate("/login")}
          >Login</button>
          <button className="px-4 py-2 bg-black text-white hover:bg-gray-800 rounded"
            onClick={() => navigate("/signup")}
          >Register</button>
        </div>
      </header >

      {/* Main Content */}
      < main className="text-center max-w-3xl mt-16" >
        <h2 className="text-4xl font-bold leading-tight">
          Smart project management <br /> with AI assistant
        </h2>
        <p className="mt-4 text-gray-600">
          AI-powered project management platform that reads, summarizes, and analyzes documents.
          Optimize your team's workflow.
        </p>
        <button className="mt-6 px-6 py-3 text-lg bg-black text-white hover:bg-gray-800 rounded" onClick={() => navigate("/signup")}>Sign up now</button>
      </main >

      {/* Features Section */}
      < section className="mt-16 w-full px-6 max-w-5xl text-center" >
        <h3 className="text-2xl font-semibold">Comprehensive solutions for your team</h3>
        <div className="flex justify-center mt-8 space-x-6">
          <div className="flex flex-col items-center max-w-xs">
            <FaRobot className="text-4xl bg-black text-white p-2 rounded-md" />
            <h4 className="font-semibold mt-4">Smart AI Bot</h4>
            <p className="text-gray-600 text-sm mt-2">
              Automatically read and summarize project documents, answer questions, and suggest solutions.
            </p>
          </div>
          <div className="flex flex-col items-center max-w-xs">
            <FaTasks className="text-4xl bg-black text-white p-2 rounded-md" />
            <h4 className="font-semibold mt-4">Project Management</h4>
            <p className="text-gray-600 text-sm mt-2">
              Track progress, assign work and manage resources effectively.
            </p>
          </div>
          <div className="flex flex-col items-center max-w-xs">
            <FaChartBar className="text-4xl bg-black text-white p-2 rounded-md" />
            <h4 className="font-semibold mt-4">Analysis & Reporting</h4>
            <p className="text-gray-600 text-sm mt-2">
              Generate automated reports, analyze data and provide project insights.
            </p>
          </div>
        </div>
      </section >

      {/* Footer */}
      < footer className="mt-16 w-full py-6 border-t text-center text-gray-500 text-sm" >
        <p>&copy; 2024 Project AI. Copyright belongs to the company.</p>
      </footer >
    </div >
  );
};

export default MainLandingPage;
