import React, { useState } from 'react';

const statusColors: Record<UserStatus, string> = {
  Active: 'bg-green-500 text-white',
  'Pending approval': 'bg-orange-500 text-white',
  Locked: 'bg-gray-500 text-white',
};

type UserStatus = 'Active' | 'Pending approval' | 'Locked';

interface User {
  id: string;
  username: string;
  email: string;
  status: UserStatus;
}

const AdminUsersManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    { id: 'AD_01', username: 'nguyenvana', email: 'nguyenvana@gmail.com', status: 'Active' },
    { id: 'AD_02', username: 'tranvanb', email: 'tranvanb@gmail.com', status: 'Pending approval' },
    { id: 'AD_03', username: 'phamthic', email: 'phamthic@gmail.com', status: 'Locked' },
    { id: 'AD_04', username: 'lethid', email: 'lethid@gmail.com', status: 'Active' },
    { id: 'AD_05', username: 'dangvanh', email: 'dangvanh@gmail.com', status: 'Pending approval' },
    { id: 'AD_06', username: 'buiduc', email: 'buiduc@gmail.com', status: 'Locked' },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;
  const totalPages = Math.ceil(users.length / usersPerPage);

  const addUser = () => {
    const newUser: User = {
      id: `AD_0${users.length + 1}`,
      username: `newuser${users.length + 1}`,
      email: `newuser${users.length + 1}@gmail.com`,
      status: 'Pending approval',
    };
    setUsers([...users, newUser]);
  };

  const deleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const paginatedUsers = users.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  return (
    <div className="container mx-auto mt-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">User Management</h1>
        <button onClick={addUser} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Add New User
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-6 border-b text-center">ID</th>
              <th className="py-3 px-6 border-b text-center">Username</th>
              <th className="py-3 px-6 border-b text-center">Email</th>
              <th className="py-3 px-6 border-b text-center">Status</th>
              <th className="py-3 px-6 border-b text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map(user => (
              <tr key={user.id} className="text-center">
                <td className="py-3 px-6 border-b">{user.id}</td>
                <td className="py-3 px-6 border-b">{user.username}</td>
                <td className="py-3 px-6 border-b">{user.email}</td>
                <td className="py-3 px-6 border-b">
                  <span className={`px-4 py-2 rounded-full ${statusColors[user.status] || 'bg-gray-400 text-white'}`}>
                    {user.status}
                  </span>
                </td>
                <td className="py-3 px-6 border-b flex justify-center gap-2">
                  <button className="text-red-500 hover:text-red-700" onClick={() => deleteUser(user.id)}>
                    &#10060;
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-between items-center">
        <span>Showing {(currentPage - 1) * usersPerPage + 1} to {Math.min(currentPage * usersPerPage, users.length)} of {users.length} records</span>
        <div className="flex space-x-2">
          <button
            className="border px-3 py-1 rounded bg-white hover:bg-gray-100"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            {'<'}
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={`border px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'}`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
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
    </div>
  );
};

export default AdminUsersManagement;
