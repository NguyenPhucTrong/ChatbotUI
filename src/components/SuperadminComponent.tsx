import React, { useState } from 'react';

const statusColors = {
  Active: 'bg-green-500 text-white',
  Pending: 'bg-orange-500 text-white',
  Inactive: 'bg-gray-500 text-white',
};

const SuperadminComponent = () => {
  const [admins, setAdmins] = useState([
    { name: 'John Doe', email: 'john.doe@example.com', role: 'Admin', status: 'Active' },
    { name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Admin', status: 'Active' },
  ]);

  const createAdminAccount = () => {
    const newAdmin = {
      name: `New Admin ${admins.length + 1}`,
      email: `newadmin${admins.length + 1}@example.com`,
      role: 'Admin',
      status: 'Pending',
    };
    setAdmins([...admins, newAdmin]);
  };

  const deleteAdmin = (index: number) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      setAdmins(admins.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Admin Account Management</h1>
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search by name, email..."
            className="border border-gray-300 rounded-md py-2 px-4 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Search
          </button>
          <button onClick={createAdminAccount} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2">
            Create Admin Account
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 text-center">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-6 border-b">Name</th>
              <th className="py-3 px-6 border-b">Email</th>
              <th className="py-3 px-6 border-b">Role</th>
              <th className="py-3 px-6 border-b">Status</th>
              <th className="py-3 px-6 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin, index) => (
              <tr key={index}>
                <td className="py-3 px-6 border-b">{admin.name}</td>
                <td className="py-3 px-6 border-b">{admin.email}</td>
                <td className="py-3 px-6 border-b">{admin.role}</td>
                <td className="py-3 px-6 border-b">
                  <span className={`px-4 py-2 rounded-full ${statusColors[admin.status] || 'bg-gray-400 text-white'}`}>
                    {admin.status}
                  </span>
                </td>
                <td className="py-3 px-6 border-b flex justify-center gap-2">
                  <button className="text-blue-500 hover:text-blue-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M17.414 2.586a2 2 0 00-2.828 0L7 8.656a1 1 0 01-.293.293l-2.828 2.828a1 1 0 00-.293.293l-2.828 2.828a2 2 0 000 2.828l5.866 5.866a2 2 0 002.828 0L18.414 6.414a2 2 0 000-2.828z" />
                    </svg>
                  </button>
                  <button onClick={() => deleteAdmin(index)} className="text-red-500 hover:text-red-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <span>Showing 1 to {admins.length} of 50 total records</span>
        <div className="flex justify-end">
          <button className="border border-gray-300 text-gray-500 px-3 py-1 rounded-md bg-white hover:bg-gray-100">
            {'<'}
          </button>
          <button className="border border-gray-300 text-white px-3 py-1 rounded-md bg-black">1</button>
          <button className="border border-gray-300 text-gray-700 px-3 py-1 rounded-md bg-white hover:bg-gray-100">
            2
          </button>
          <button className="border border-gray-300 text-gray-500 px-3 py-1 rounded-md bg-white hover:bg-gray-100">
            {'>'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuperadminComponent;
