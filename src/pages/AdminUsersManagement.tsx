import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  getUsersPagination,
  createUser,
  updateUser,
  deleteUser,
  getAllUsers,
} from "../services/UserServices";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Navigate } from "react-router-dom";
import { MdSearch } from "react-icons/md";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type Role = "Super Admin" | "Admin" | "User";

interface User {
  IdUser: number;
  Username: string;
  Fullname: string;
  Email: string;
  PhoneNumber: string;
  Role: Role;
  Password?: string | null;
}

const AdminUsersManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const usersPerPage = 10;
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<Role>("User");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem("userToken");

  if (!token) {
    toast.error("Please login to access this page.");
    return <Navigate to="/" />;
  }

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsersPagination(currentPage, usersPerPage);
      if (response && response.data && response.data.data) {
        setUsers(response.data.data);
        setTotalPages(response.data.totalPages);
        setTotalUsers(response.data.totalItems);
      } else {
        toast.error("Invalid response format from server");
        setUsers([]);
        setTotalPages(0);
        setTotalUsers(0);
      }
      setLoading(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch users");
      setLoading(false);
    }
  };

  const filteredUsers = (users: User[]) => {
    if (!searchTerm) return users;

    return users.filter((user) => {
      return (
        user.Username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.Fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.Email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.PhoneNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.Role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !username ||
      !fullname ||
      !email ||
      !phoneNumber ||
      !password ||
      !confirmPassword
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const newUser = {
        Username: username.trim(),
        Fullname: fullname.trim(),
        Email: email.trim(),
        Password: password.trim(),
        PhoneNumber: phoneNumber.trim(),
        Role: role,
      };

      await createUser(newUser);
      toast.success("User added successfully");
      setShowAddModal(false);
      resetForm();
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to add user");
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      const updatedUser: any = {
        Username: username.trim(),
        Fullname: fullname.trim(),
        Email: email.trim(),
        PhoneNumber: phoneNumber.trim(),
        Role: role,
        Permission: "default_permission", // Thêm trường này nếu backend yêu cầu
      };

      if (password && password.trim() !== "") {
        if (password !== confirmPassword) {
          toast.error("Passwords do not match");
          return;
        }
        updatedUser.Password = password.trim();
      }

      await updateUser(currentUser.IdUser, updatedUser, token);
      toast.success("User updated successfully");
      setShowEditModal(false);
      resetForm();
      fetchUsers();
    } catch (error: any) {
      console.error("Error updating user:", error);
      if (error.response?.status === 422) {
        // Xử lý lỗi validation
        const errorDetails = error.response.data.detail;
        if (Array.isArray(errorDetails)) {
          const errorMessages = errorDetails
            .map((err: any) => {
              const field = err.loc?.[1] || "field";
              return `${field}: ${err.msg}`;
            })
            .join("\n");
          toast.error(`Validation errors:\n${errorMessages}`);
        } else {
          toast.error(errorDetails || "Invalid data format");
        }
      } else {
        toast.error(error.response?.data?.message || "Failed to update user");
      }
    }
  };
  const handleDeleteUser = async (userId: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(userId, token);
        toast.success("User deleted successfully");
        fetchUsers();
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to delete user");
      }
    }
  };

  const openEditModal = (user: User) => {
    setCurrentUser(user);
    setUsername(user.Username);
    setFullname(user.Fullname);
    setEmail(user.Email);
    setPhoneNumber(user.PhoneNumber);
    setRole(user.Role);
    setPassword(user.Password || "");
    setConfirmPassword(user.Password || "");
    setShowEditModal(true);
  };

  const resetForm = () => {
    setUsername("");
    setFullname("");
    setEmail("");
    setPhoneNumber("");
    setPassword("");
    setConfirmPassword("");
    setRole("User");
    setCurrentUser(null);
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (value !== password) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const userRoleCounts = users.reduce((acc: any, user: User) => {
    acc[user.Role] = (acc[user.Role] || 0) + 1;
    return acc;
  }, {});

  const roleChartData = {
    labels: Object.keys(userRoleCounts),
    datasets: [
      {
        label: "Number of users",
        data: Object.values(userRoleCounts),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  const roleChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Number of Users by Role",
      },
    },
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <Bar data={roleChartData} options={roleChartOptions} />
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
        >
          Add New User
        </button>
        <div className="relative w-full md:w-1/2">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <MdSearch
            size={24}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded shadow">
          <thead>
            <tr className="bg-gray-300">
              <th className="px-6 py-4 text-left font-semibold text-gray-700 border-b">
                ID
              </th>
              <th className="px-6 py-4 text-left font-semibold text-gray-700 border-b">
                Username
              </th>
              <th className="px-6 py-4 text-left font-semibold text-gray-700 border-b">
                Full Name
              </th>
              <th className="px-6 py-4 text-left font-semibold text-gray-700 border-b">
                Email
              </th>
              <th className="px-6 py-4 text-left font-semibold text-gray-700 border-b">
                Phone
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
            {filteredUsers(users).length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center">
                  {searchTerm
                    ? "No users found matching your search."
                    : "No users available."}
                </td>
              </tr>
            ) : (
              filteredUsers(users).map((user) => {
                if (user.Role === "Admin" || user.Role === "Super Admin") {
                  if (localStorage.getItem("userRole") === "Admin") {
                    return;
                  }
                }
                return (
                  <tr key={user.IdUser} className="hover:bg-gray-100">
                    <td className="px-6 py-4 border-b">{user.IdUser}</td>
                    <td className="px-6 py-4 border-b">{user.Username}</td>
                    <td className="px-6 py-4 border-b">{user.Fullname}</td>
                    <td className="px-6 py-4 border-b">{user.Email}</td>
                    <td className="px-6 py-4 border-b">{user.PhoneNumber}</td>
                    <td className="px-6 py-4 border-b">{user.Role}</td>
                    <td className="px-6 py-4 border-b">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditModal(user)}
                          className="text-blue-500 hover:text-blue-700 px-2 py-1 border border-blue-500 rounded hover:bg-blue-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.IdUser)}
                          className="text-red-500 hover:text-red-700 px-2 py-1 border border-red-500 rounded hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {!searchTerm && (
        <div className="mt-4 flex justify-between items-center">
          <span>
            Showing {(currentPage - 1) * usersPerPage + 1} to{" "}
            {Math.min(currentPage * usersPerPage, totalUsers)} of {totalUsers}{" "}
            records
          </span>
          <div className="flex space-x-2">
            <button
              className="border px-3 py-1 rounded bg-white hover:bg-gray-100"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              {"<"}
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`border px-3 py-1 rounded ${
                  currentPage === page
                    ? "bg-black text-white"
                    : "bg-white hover:bg-gray-100"
                }`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
            <button
              className="border px-3 py-1 rounded bg-white hover:bg-gray-100"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              {">"}
            </button>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New User</h2>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                  className="w-full px-3 py-2 border rounded"
                >
                  {localStorage.getItem("userRole") === "Super Admin" ? (
                    <>
                      <option value="User">User</option>
                      <option value="Admin">Admin</option>
                      <option value="Super Admin">Super Admin</option>
                    </>
                  ) : (
                    <option value="User">User</option>
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-2 text-sm text-gray-500"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                  className={`w-full px-3 py-2 border rounded ${
                    passwordError ? "border-red-500" : ""
                  }`}
                  required
                />
                {passwordError && (
                  <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                  disabled={!!passwordError}
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && currentUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>
            <div className="flex flex-row items-center justify-center text-center mb-6 space-x-6">
              <div className="flex flex-col items-center">
                <img
                  src="..\src\assets\image\flower1.png"
                  alt="Avatar"
                  className="w-24 h-24 rounded-full shadow-md"
                />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="text-2xl font-bold mt-2 text-center border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                  className="w-full px-3 py-2 border rounded"
                  // disabled={currentUser?.Role === 'User' | 'Admin'}
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                  <option value="Super Admin">Super Admin</option>
                </select>
                {/* {currentUser?.Role === 'Admin' | 'Super Admin' && (
                  <p className="text-sm text-gray-500 mt-1">
                    Role cannot be changed for Admin users.
                  </p>
                )} */}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  New Password (leave blank to keep current)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-2 text-sm text-gray-500"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              {password && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) =>
                      handleConfirmPasswordChange(e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded ${
                      passwordError ? "border-red-500" : ""
                    }`}
                  />
                  {passwordError && (
                    <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                  )}
                </div>
              )}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                  disabled={!!passwordError}
                >
                  Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersManagement;
