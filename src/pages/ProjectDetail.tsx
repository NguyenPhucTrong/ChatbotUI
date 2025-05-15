import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import { AiOutlineRobot, AiOutlineFile, AiOutlineDelete } from "react-icons/ai"; // Import AI icon, file and delete icons
import ChatAI from "./ChatAI"; // Import ChatAI
import { getProjectById } from "../services/ProjectsServices"; // Import API to fetch project details
import { getProjectMembers, addMemberToProject, removeMemberFromProject } from "../services/ProjectMembers"; // Import member services
import { getUsersPagination } from "../services/UserServices";
import { askQuestion } from "../services/AIService"; // Import askQuestion từ AIService

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  uploadDate: string;
  url: string;
  publicId: string;
  folder: string;
}

interface Message {
  sender: "me" | "bot";
  text: string;
}

interface Member {
  id: number;
  fullname: string;
  email: string;
  phoneNumber: string;
  userole: string;
}

interface User {
  id: number;
  fullname: string;
  email: string;
  phoneNumber: string;
  selectedRole?: string;
  role?: string;
}

export default function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>(); // Get projectId from URL
  const navigate = useNavigate(); // Initialize navigate
  const [projectName, setProjectName] = useState<string>(""); // State for project name
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [folderPath, setFolderPath] = useState(`projects/${projectId}`);
  const [messages, setMessages] = useState<Message[]>([
    { sender: "bot", text: "Welcome to the project chat!" },
  ]);
  const [members, setMembers] = useState<Member[]>([]); // State for project members
  const [users, setUsers] = useState<User[]>([]); // State for all users
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); // Number of users per page
  const [totalPages, setTotalPages] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false); // State for ChatAI modal
  const [isAllUsersOpen, setIsAllUsersOpen] = useState(false); // State for All Users modal

  const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL!;
  const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET!;

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setSelectedFiles((prev) => [...prev, ...acceptedFiles]);
        toast.success(`${acceptedFiles.length} file(s) added!`);
      }
    },
    multiple: true,
    accept: {
      "application/pdf": [".pdf"],
      "text/plain": [".txt"],
      "application/json": [".json"],
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
  });

  useEffect(() => {
    // Fetch project details to get the project name
    const fetchProjectDetails = async () => {
      try {
        const response = await getProjectById(Number(projectId));
        setProjectName(response.data.ProjectName); // Set project name
      } catch (error) {
        console.error("Error fetching project details:", error);
        toast.error("Failed to load project details.");
      }
    };

    // Fetch project members
    const fetchMembers = async () => {
      try {
        const response = await getProjectMembers(Number(projectId));
        const membersData = response.data.map((member: any) => ({
          id: member.IdUser,
          fullname: member.Fullname,
          email: member.Email,
          phoneNumber: member.PhoneNumber,
          userole: member.UserRole,
        }));
        setMembers(membersData);
      } catch (error) {
        console.error("Error fetching project members:", error);
        toast.error("Failed to load project members.");
      }
    };

    // Fetch all users
    const fetchUsers = async (page: number = 1, pageSize: number = 10) => {
      try {
        const response = await getUsersPagination(page, pageSize);
        const fetchedUsers = response.data.data.map((user: any) => ({
          id: user.IdUser,
          fullname: user.Fullname,
          email: user.Email,
          phoneNumber: user.PhoneNumber,
          role: user.Role,
        }));
        setUsers(fetchedUsers);
        setTotalPages(response.data.totalPages || 0);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users.");
      }
    };

    fetchProjectDetails();
    fetchMembers();
    fetchUsers(currentPage, pageSize);
  }, [projectId, currentPage, pageSize]);

  const handleRoleChange = (userId: number, role: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, selectedRole: role } : user
      )
    );
  };

  const handleAddUserToProject = async (userId: number) => {
    const user = users.find((u) => u.id === userId);
    if (!user?.selectedRole || user.selectedRole.trim() === "") {
      toast.error("Please select a role for the user before adding them to the project.");
      return;
    }
    try {
      await addMemberToProject(Number(projectId), userId, user.selectedRole);
      toast.success("User added to project successfully!");
      setMembers((prev) => [
        ...prev,
        {
          id: userId,
          fullname: user.fullname,
          email: user.email,
          phoneNumber: user.phoneNumber,
          userole: user.selectedRole,
        },
      ]);
    } catch (error) {
      console.error("Error adding user to project:", error);
      toast.error("Failed to add user to project.");
    }
  };

  const handleRemoveMember = async (memberId: number) => {
    try {
      await removeMemberFromProject(memberId);
      setMembers((prev) => prev.filter((member) => member.id !== memberId));
      toast.success("Member removed successfully!");
    } catch (error) {
      console.error("Error removing member:", error);
      toast.error("Failed to remove member.");
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one file to upload!");
      return;
    }

    setIsUploading(true);

    const uploadPromises = selectedFiles.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      formData.append("folder", folderPath);
      formData.append("tags", `project-${projectId}`);

      const fileNameWithoutExt = file.name.split(".").slice(0, -1).join(".");
      formData.append("public_id", fileNameWithoutExt);

      try {
        const response = await fetch(CLOUDINARY_URL, {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        setUploadedFiles((prev) => [
          ...prev,
          {
            id: data.asset_id,
            name: data.original_filename,
            size: data.bytes,
            uploadDate: new Date().toLocaleDateString(),
            url: data.secure_url,
            publicId: data.public_id,
            folder: data.folder,
          },
        ]);
        toast.success(`File "${file.name}" uploaded successfully!`);
      } catch (error) {
        console.error("Error uploading file:", error);
        toast.error(`Failed to upload file "${file.name}".`);
      }
    });

    await Promise.all(uploadPromises);
    setSelectedFiles([]);
    setIsUploading(false);
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeUploadedFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const handleMessages = async (text: string) => {
    setMessages((prevMessages) => [...prevMessages, { text, sender: "me" }]);
  
    try {
      const question = {
        idProject: Number(projectId), // Sử dụng projectId từ URL
        query: text,
      };
      const res = await askQuestion(question); // Gửi query đến API
      console.log("Response:", res);
      if (res.status === 200) {
        const botMessage = res.data.Answer; // Lấy câu trả lời từ response
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: botMessage, sender: "bot" },
        ]);
      } else {
        console.error("Error:", res.data.message);
      }
    } catch (e) {
      console.error("Error:", e.response?.data || e.message);
    }
  };
  
  // Thay đổi hàm handleSendMessage để sử dụng handleMessages
  const handleSendMessage = (text: string) => {
    handleMessages(text); // Gọi hàm handleMessages
  };

  // Filter users to exclude those already in the project
  const filteredUsers = users.filter(
    (user) => !members.some((member) => member.id === user.id)
  );

  const roles = [
    "Frontend Developer",
    "Tester",
    "UI/UX Designer",
    "Backend Developer",
    "Business Analysis",
    "AI Researcher",
  ];

  return (
    <div className="p-6">
      {/* Back Button */}
      <button
        onClick={() => navigate("/project-management")}
        className="mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
      >
        Back to Project Management
      </button>

      {/* Updated Title */}
      <h1 className="text-3xl font-semibold mb-4">
        {projectName} - ID: {projectId}
      </h1>

      {/* Project Members Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Project Members</h2>
        <ul className="list-disc pl-6">
          {members.length > 0 ? (
            members.map((member) => (
              <li key={member.id} className="flex justify-between items-center">
                <span>
                  {member.fullname} ({member.email}) - Role: {member.userole}
                </span>
                <button
                  onClick={() => handleRemoveMember(member.id)}
                  className="text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50"
                >
                  Remove
                </button>
              </li>
            ))
          ) : (
            <p>No members in this project.</p>
          )}
        </ul>
      </div>

      {/* All Users Button */}
      <div className="mb-6">
        <button
          onClick={() => setIsAllUsersOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          All Users
        </button>
      </div>

      {/* All Users Modal */}
      {isAllUsersOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-[80%] h-[80%] rounded-lg shadow-lg p-6 flex flex-col">
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-2xl font-bold">All Users</h2>
              <button
                onClick={() => setIsAllUsersOpen(false)}
                className="text-red-500 text-xl"
              >
                ✖
              </button>
            </div>
            <div className="flex-1 overflow-auto mt-4">
              {filteredUsers.length > 0 ? (
                <table className="min-w-full bg-white border border-gray-300 rounded shadow">
                  <thead>
                    <tr className="bg-gray-300">
                      <th className="px-6 py-4 text-left font-semibold text-gray-700 border-b">
                        Full Name
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-700 border-b">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-700 border-b">
                        Phone Number
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-700 border-b">
                        Role
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-700 border-b">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-100">
                        <td className="px-6 py-4 border-b">{user.fullname}</td>
                        <td className="px-6 py-4 border-b">{user.email}</td>
                        <td className="px-6 py-4 border-b">{user.phoneNumber}</td>
                        <td className="px-6 py-4 border-b">
                          <select
                            value={user.selectedRole || ""}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            className="border border-gray-300 rounded px-2 py-1"
                          >
                            <option value="" disabled>
                              Select Role
                            </option>
                            {roles.map((role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4 border-b">
                          <button
                            onClick={() => handleAddUserToProject(user.id)}
                            className="text-blue-500 hover:text-blue-700 px-2 py-1 border border-blue-500 rounded hover:bg-blue-50"
                          >
                            Add to Project
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500">No users available to add to this project.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Upload Files Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Upload Files</h2>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed p-4 rounded-lg ${
            isDragActive ? "border-blue-500" : "border-gray-300"
          }`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here...</p>
          ) : (
            <p>Drag & drop files here, or click to select files</p>
          )}
        </div>
        <ul className="mt-4">
          {selectedFiles.map((file, index) => (
            <li key={index} className="flex justify-between items-center">
              <span>{file.name}</span>
              <button
                onClick={() => removeSelectedFile(index)}
                className="text-red-500 hover:underline"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
        <button
          onClick={handleUpload}
          className={`mt-4 px-4 py-2 rounded bg-blue-500 text-white ${
            isUploading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
          }`}
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Upload Files"}
        </button>
      </div>

      {/* Uploaded Files Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Uploaded Files</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {uploadedFiles.map((file) => (
            <div
              key={file.id}
              className="border rounded-lg p-4 flex flex-col items-center bg-gray-50 shadow"
            >
              {/* File Icon */}
              <AiOutlineFile size={40} className="text-blue-500 mb-2" />
              {/* File Name */}
              <p className="text-sm font-semibold text-gray-700 text-center truncate">
                {file.name}
              </p>
              {/* File Size */}
              <p className="text-xs text-gray-500">
                {(file.size / 1024).toFixed(2)} KB
              </p>
              {/* Upload Date */}
              <p className="text-xs text-gray-500">
                Uploaded: {file.uploadDate}
              </p>
              {/* Actions */}
              <button
                onClick={() => removeUploadedFile(file.id)}
                className="mt-2 text-red-500 hover:text-red-700 flex items-center"
              >
                <AiOutlineDelete className="mr-1" />
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Floating AI Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none"
        style={{ zIndex: 1000 }}
      >
        <AiOutlineRobot size={24} />
      </button>

      {/* ChatAI Modal */}
      {isChatOpen && (
        <div
          className="fixed bottom-4 right-4 bg-white w-[400px] h-[500px] rounded-lg shadow-lg p-4 flex flex-col z-50"
          style={{ zIndex: 1000 }}
        >
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-lg font-bold">AI Chat Assistant</h2>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-red-500 text-xl"
            >
              ✖
            </button>
          </div>
          <div className="flex-1 overflow-auto mt-4">
            <ChatAI
              messages={messages}
              onNewChat={() => setMessages([{ sender: "bot", text: "New chat started!" }])}
              onSend={handleSendMessage} // Sử dụng handleSendMessage
              chatHistory={[]}
              onSelectChat={() => {}}
            />
          </div>
        </div>
      )}
    </div>
  );
}