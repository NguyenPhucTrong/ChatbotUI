import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  getUsersPagination,
  createUser,
  updateUser,
  deleteUser,
  getAllUsers
} from '../services/UserServices';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Navigate } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface User {
  IdUser: number;
  Username: string;
  Fullname: string;
  Email: string;
  PhoneNumber: string;
  Role: 'user' | 'admin';
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
  // Form states for add/edit
  const [username, setUsername] = useState('');
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [status, setStatus] = useState<'Active' | 'Pending approval' | 'Locked'>('Active');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const token = localStorage.getItem('userToken');

  if (!token) {
    toast.error('Vui lòng đăng nhập để truy cập trang này.');
    return <Navigate to="/" />;
  }

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsersPagination(currentPage, usersPerPage, token);
      if (response && response.data && response.data.data) {
        setUsers(response.data.data);
        console.log('Dữ liệu người dùng:', response.data.data);
        setTotalPages(response.data.totalPages);
        setTotalUsers(response.data.totalItems);
      } else {
        toast.error('Invalid response format from server');
        setUsers([]);
        setTotalPages(0);
        setTotalUsers(0);
      }
      setLoading(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch users');
      setLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !fullname || !email || !phoneNumber || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
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

      await createUser(newUser, token);
      toast.success('User added successfully');
      setShowAddModal(false);
      resetForm();
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to add user');
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    try {
      const updatedUser = {
        Username: username.trim(),
        Fullname: fullname.trim(),
        Email: email.trim(),
        PhoneNumber: phoneNumber.trim(),
        Role: role,
        ...(password && { Password: password.trim() }),
      };

      await updateUser(currentUser.IdUser, updatedUser, token);
      toast.success('User updated successfully');
      setShowEditModal(false);
      resetForm();
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to update user');
    }
  };

  const handleDeleteUser = async (IdUser: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(IdUser, token);
        toast.success('User deleted successfully');
        // If we're on the last page with only one user, go back a page
        if (users.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          fetchUsers();
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to delete user');
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
    setPassword('');
    setConfirmPassword('');
    setShowEditModal(true);
  };

  const resetForm = () => {
    setUsername('');
    setFullname('');
    setEmail('');
    setPhoneNumber('');
    setPassword('');
    setConfirmPassword('');
    setRole('user');
    setStatus('Active');
    setCurrentUser(null);
  };  

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (value !== password) {
      setPasswordError('Passwords do not match');
    } else {
      setPasswordError('');
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Dữ liệu cho biểu đồ người dùng theo vai trò
  const userRoleCounts = users.reduce((acc: any, user: User) => {
    acc[user.Role] = (acc[user.Role] || 0) + 1;
    return acc;
  }, {});

  const roleChartData = {
    labels: Object.keys(userRoleCounts),
    datasets: [
      {
        label: 'Số lượng Người dùng',
        data: Object.values(userRoleCounts),
        backgroundColor: ['#FF6384', '#36A2EB'],
      },
    ],
  };

  const roleChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Số lượng Người dùng theo Vai trò',
      },
    },
  };

  // Dữ liệu cho biểu đồ người dùng theo trạng thái
  const userStatusCounts = users.reduce((acc: any, user: User) => {
    acc[user.Status] = (acc[user.Status] || 0) + 1;
    return acc;
  }, {});

  const statusChartData = {
    labels: Object.keys(userStatusCounts),
    datasets: [
      {
        label: 'Số lượng Người dùng',
        data: Object.values(userStatusCounts),
        backgroundColor: [
          '#4BC0C0', // Active
          '#FFCE56', // Pending approval
          '#FF6384', // Locked
        ],
      },
    ],
  };

  const statusChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Số lượng Người dùng',
      },
    },
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>

      {/* Biểu đồ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <Bar data={roleChartData} options={roleChartOptions} />
        </div>
        <div>
          <Bar data={statusChartData} options={statusChartOptions} />
        </div>
      </div>

      <button
        onClick={() => setShowAddModal(true)}
        className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800 mb-4"
      >
        Add New User
      </button>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded shadow">
          <thead>
            <tr className="bg-gray-300">
              <th className="px-6 py-4 text-left font-semibold text-gray-700 border-b">ID</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-700 border-b">Username</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-700 border-b">Full Name</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-700 border-b">Email</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-700 border-b">Phone</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-700 border-b">Role</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-700 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center">
                  Không có người dùng nào.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.IdUser} className="hover:bg-gray-100">
                  <td className="px-6 py-4 border-b">{user.IdUser}</td>
                  <td className="px-6 py-4 border-b">{user.Username}</td>
                  <td className="px-6 py-4 border-b">{user.Fullname}</td>
                  <td className="px-6 py-4 border-b">{user.Email}</td>
                  <td className="px-6 py-4 border-b">{user.PhoneNumber}</td>
                  <td className="px-6 py-4 border-b capitalize">{user.Role}</td>
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
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <span>
          Showing {(currentPage - 1) * usersPerPage + 1} to{' '}
          {Math.min(currentPage * usersPerPage, totalUsers)} of {totalUsers} records
        </span>
        <div className="flex space-x-2">
          <button
            className="border px-3 py-1 rounded bg-white hover:bg-gray-100"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            {'<'}
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`border px-3 py-1 rounded ${
                currentPage === page ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'
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
            {'>'}
          </button>
        </div>
      </div>

           {/* Add User Modal */}
           {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New User</h2>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
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
                <label className="block text-sm font-medium mb-1">Phone Number</label>
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
                  onChange={(e) => setRole(e.target.value as 'user' | 'admin')}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
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
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                  className={`w-full px-3 py-2 border rounded ${
                    passwordError ? 'border-red-500' : ''
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
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
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
                <label className="block text-sm font-medium mb-1">Phone Number</label>
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
                  onChange={(e) => setRole(e.target.value as 'user' | 'admin')}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'Active' | 'Pending approval' | 'Locked')}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="Active">Active</option>
                  <option value="Pending approval">Pending approval</option>
                  <option value="Locked">Locked</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  New Password (leave blank to keep current)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-2 text-sm text-gray-500"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
              {password && (
                <div>
                  <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                    className={`w-full px-3 py-2 border rounded ${
                      passwordError ? 'border-red-500' : ''
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