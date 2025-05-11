import React, { useEffect, useState } from "react";
import { createUserPermission } from "../services/PermissionsServices";
import { getAllUsers, getUsersPagination } from "../services/UserServices";
import { getAllProjects } from "../services/ProjectsServices";
import { toast } from "react-toastify";

const permissions = [
    { name: "Users", actions: ["GET", "POST", "PUT", "DELETE"] },
    { name: "Projects", actions: ["GET", "POST", "PUT", "DELETE"] },
    { name: "Tasks", actions: ["GET", "POST", "PUT", "DELETE"] },
];

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

export default function SuperAdmin() {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedAdmin, setSelectedAdmin] = useState<number | null>(null);
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10); // Số lượng người dùng mỗi trang
    const [totalPages, setTotalPages] = useState(0);

    // Lấy danh sách user
    useEffect(() => {
        const fetchUsers = async (page: number = 1, pageSize: number = 10) => {
            try {
                const response = await getUsersPagination(page, pageSize);
                console.log("API Response:", response.data);

                if (!response.data || !response.data.data) {
                    console.warn("Invalid response format:", response.data);
                    setUsers([]);
                    setTotalPages(0);
                    return;
                }

                const fetchedUsers = response.data.data
                    .map((user: any) => ({
                        id: user.IdUser,
                        fullname: user.Fullname,
                        email: user.Email,
                        phoneNumber: user.PhoneNumber,
                        role: user.Role,
                    }))
                    .filter((user) => user.role === "Admin"); // Lọc chỉ lấy Admin

                setUsers(fetchedUsers);
                setTotalPages(response.data.totalPages || 0);

                // Nếu không còn user nào và đang ở trang > 1, chuyển về trang trước
                if (fetchedUsers.length === 0 && page > 1) {
                    setCurrentPage((prev) => Math.max(prev - 1, 1));
                }
            } catch (error) {
                console.error("Error fetching users:", error);
                toast.error("Failed to load users.");
            }
        };

        fetchUsers(currentPage, pageSize);
    }, [currentPage, pageSize]);

    const handleCheckboxChange = async (
        resource: string,
        action: string,
        checked: boolean
    ) => {
        if (!selectedAdmin) {
            toast.error("Please select an admin first!");
            return; // Ngăn không cho phép thay đổi trạng thái checkbox
        }

        const permission = `${action}: ${resource}`;
        let updatedPermissions = [...selectedPermissions];

        if (checked) {
            updatedPermissions.push(permission);
            // Gọi API thêm quyền
            await createUserPermission(selectedAdmin, [permission]);
        } else {
            updatedPermissions = updatedPermissions.filter((p) => p !== permission);
            // Gọi API xóa quyền
            await createUserPermission(selectedAdmin, updatedPermissions);
        }

        setSelectedPermissions(updatedPermissions);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Super Admin Permissions</h1>

            {/* Danh sách user */}
            <div>
                <h2 className="text-2xl font-semibold mb-4">All Users</h2>
                <div className="overflow-x-auto">
                    {users.length > 0 ? (
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
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td className="px-6 py-4 border-b">{user.fullname}</td>
                                        <td className="px-6 py-4 border-b">{user.email}</td>
                                        <td className="px-6 py-4 border-b">{user.phoneNumber}</td>
                                        <td className="px-6 py-4 border-b">{user.role}</td>
                                        <td className="px-6 py-4 border-b">
                                            <input
                                                type="checkbox"
                                                checked={selectedAdmin === user.id}
                                                onChange={(e) =>
                                                    setSelectedAdmin(e.target.checked ? user.id : null)
                                                }
                                                className="w-5 h-5"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-gray-500">No users available.</p>
                    )}
                </div>
                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="pagination mt-4 flex justify-between">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span>
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            disabled // Luôn vô hiệu hóa nút "Next"
                            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            {/* Bảng phân quyền */}
            <table className="table-auto w-full border-collapse border border-gray-700 mt-6">
                <thead>
                    <tr>
                        <th className="border border-gray-700 px-4 py-2">Resource</th>
                        {["GET", "POST", "PUT", "DELETE"].map((action) => (
                            <th key={action} className="border border-gray-700 px-4 py-2">
                                {action}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {permissions.map((permission) => (
                        <tr key={permission.name}>
                            <td className="border border-gray-700 px-4 py-2">
                                {permission.name}
                            </td>
                            {permission.actions.map((action) => (
                                <td
                                    key={`${permission.name}-${action}`}
                                    className="border border-gray-700 px-4 py-2 text-center"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedPermissions.includes(
                                            `${action}: ${permission.name}`
                                        )}
                                        onChange={(e) =>
                                            handleCheckboxChange(
                                                permission.name,
                                                action,
                                                e.target.checked
                                            )
                                        }
                                    />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}