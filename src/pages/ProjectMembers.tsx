import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  getProjectMembers,
  addMemberToProject,
  removeMemberFromProject,
} from "../services/ProjectMembers";
import { getAllUsers } from "../services/UserServices";
import { getAllProjects } from "../services/ProjectsServices";

interface Project {
  id: number;
  name: string;
}

interface Member {
  id: number;
  fullname: string;
  email: string;
  phoneNumber: string;
  userole: string; // UserRole trong ProjectMembers
  role?: string; // Role trong User
}

interface User {
  id: number;
  fullname: string;
  email: string;
  phoneNumber: string;
  projectId?: number; // ID của dự án mà user đang tham gia
  selectedRole?: string; // Vai trò được chọn
  role?: string; // Role property added
}

const ProjectMembersManagement: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null
  );
  const [members, setMembers] = useState<Member[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Fetch all projects
    const fetchProjects = async () => {
      try {
        const response = await getAllProjects();
        setProjects(
          response.data.data.map((project: any) => ({
            id: project.IdProject,
            name: project.ProjectName,
          }))
        );
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast.error("Failed to load projects.");
      }
    };

    // Fetch all users
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        setUsers(
          response.data.data.map((user: any) => ({
            id: user.IdUser,
            fullname: user.Fullname,
            email: user.Email,
            phoneNumber: user.PhoneNumber,
            role: user.Role, // Gán Role từ API

          }))
        );
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users.");
      }
    };

    fetchProjects();
    fetchUsers();
  }, []);

  const fetchMembers = async (id: number) => {
    try {
      const [membersResponse, usersResponse] = await Promise.all([
        getProjectMembers(id), // Lấy danh sách thành viên dự án
        getAllUsers(), // Lấy danh sách tất cả người dùng
      ]);

      const membersData = membersResponse.data;
      const usersData = usersResponse.data.data;

      if (!Array.isArray(membersData) || !Array.isArray(usersData)) {
        console.warn("Invalid response format:", membersData, usersData);
        setMembers([]);
        return;
      }

      const data = membersData.map((member: any) => {
        const user = usersData.find((u: any) => u.IdUser === member.IdUser);
        return {
          id: member.IdUser,
          fullname: member.Fullname,
          email: member.Email,
          phoneNumber: member.PhoneNumber,
          userole: member.UserRole,
          role: user?.Role || "Unknown", // Lấy Role từ users hoặc đặt mặc định là "Unknown"
        };
      });

      setMembers(data);
    } catch (error) {
      console.error("Error fetching members:", error);
      toast.error("Failed to load project members.");
    }
  };

  const handleProjectChange = (id: number) => {
    setSelectedProjectId(id);
    fetchMembers(id);
  };

  const handleRoleChange = (userId: number, role: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, selectedRole: role } : user
      )
    );
  };

  const handleAddUserToProject = async (userId: number) => {
    if (!selectedProjectId) {
      toast.error("Please select a project first.");
      return;
    }

    const user = users.find((u) => u.id === userId);
    if (!user?.selectedRole || user.selectedRole.trim() === "") {
      toast.error("Please select a role for the user before adding them to the project.");
      return;
    }
    try {
      await addMemberToProject(selectedProjectId, userId, user.selectedRole);
      toast.success("User added to project successfully!");
      fetchMembers(selectedProjectId); // Refresh members list
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === userId
            ? { ...u, projectId: selectedProjectId, selectedRole: undefined }
            : u
        )
      );
    } catch (error) {
      console.error("Error adding user to project:", error);
      toast.error("Failed to add user to project.");
    }
  };

  const handleRemoveMember = async (memberId: number) => {
    try {
      await removeMemberFromProject(memberId); // Gọi API xóa thành viên
      toast.success("Member removed from project successfully!");

      // Cập nhật danh sách thành viên sau khi xóa
      setMembers((prevMembers) => prevMembers.filter((member) => member.id !== memberId));
    } catch (error) {
      console.error("Error removing member from project:", error);
      toast.error("Failed to remove member from project.");
    }
  };

  // Lọc danh sách users để loại bỏ những người đã có trong members
  const filteredUsers = users.filter((user) => {
    const isMember = members.some((member) => member.id === user.id);
    const isAdminOrSuperAdmin = user.role === "Admin" || user.role === "Super Admin";

    console.log(`User: ${user.fullname}, Role: ${user.role}, IsMember: ${isMember}, IsAdminOrSuperAdmin: ${isAdminOrSuperAdmin}`);

    return !isMember && !isAdminOrSuperAdmin;
  });

  const roles = [
    "Frontend Developer",
    "Tester",
    "UI/UX Designer",
    "Backend Developer",
    "Business Analysis",
    "AI Researcher",
  ];

  return (
    <div className="p-6 flex-1 max-w-[1493px] mx-auto overflow-hidden">
      <h1 className="text-3xl font-semibold my-6 text-gray-800">
        Project Members Management
      </h1>

      {/* Select Project */}
      <div className="mb-6">
        <label
          htmlFor="project"
          className="block text-lg font-medium text-gray-700"
        >
          Select Project
        </label>
        <select
          id="project"
          value={selectedProjectId || ""}
          onChange={(e) => handleProjectChange(Number(e.target.value))}
          className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="" disabled>
            -- Select a project --
          </option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      {/* Members List */}
      {/* Members List */}
      {selectedProjectId && (
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Project Members</h2>
          <ul className="list-disc pl-6">
            {members.length > 0 ? (
              members.map((member) => (
                <li key={member.id} className="flex justify-between items-center">
                  <span>
                    {member.fullname} ({member.email}) Role: {member.userole}
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
      )}

      {/* Users List */}
      {selectedProjectId && filteredUsers.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">All Users</h2>
          <div className="overflow-x-auto">
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
                        onChange={(e) =>
                          handleRoleChange(user.id, e.target.value)
                        }
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
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectMembersManagement;
