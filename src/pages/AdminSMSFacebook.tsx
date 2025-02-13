import React from 'react';

const AdminSMSFacebook = () => {
  const users = [
    { date: '2024-01-20 14:30', channel: 'SMS', recipient: 'John Smith', message: 'Welcome to ABC Corporation...', status: 'Delivered' },
    { date: '2024-01-20 13:15', channel: 'Facebook', recipient: 'Jane Doe', message: 'Your account status has been updated...', status: 'Sent' },
  ];

  return (
    <div className="container mx-auto mt-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">SMS/Facebook Management</h1>
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search tenants..."
            className="border border-gray-300 rounded-md py-2 px-4 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Add New Tenant
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-md p-4">
          <h2 className="text-lg font-semibold mb-2">SMS Notifications</h2>
          <div className="flex items-center mb-2">
            <label htmlFor="sms-notifications" className="mr-2">SMS Notifications:</label>
            <input type="checkbox" id="sms-notifications" className="mr-2" />
          </div>
          <div>
            <label htmlFor="sms-message-template" className="block text-gray-700 text-sm font-bold mb-2">
              Enter message template:
            </label>
            <textarea
              id="sms-message-template"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter message template..."
            />
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">
              Save
            </button>
          </div>
          <p className="text-gray-600 text-sm mt-2">
            Available variables: {`{tenant_name}, {company_name}, {status}`}
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-md p-4">
          <h2 className="text-lg font-semibold mb-2">Facebook Messenger</h2>
          <div className="flex items-center mb-2">
            <label htmlFor="facebook-messenger" className="mr-2">Facebook Messenger:</label>
            <input type="checkbox" id="facebook-messenger" className="mr-2" />
          </div>
          <div>
            <label htmlFor="facebook-message-template" className="block text-gray-700 text-sm font-bold mb-2">
              Enter message template:
            </label>
            <textarea
              id="facebook-message-template"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter message template..."
            />
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">
              Save
            </button>
          </div>
          <p className="text-gray-600 text-sm mt-2">
            Available variables: {`{tenant_name}, {company_name}, {status}`}
          </p>
        </div>
      </div>

      {/* Notification History */}
      <div className="bg-white border border-gray-200 rounded-md p-4">
        <h2 className="text-lg font-semibold mb-2">Notification History</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 text-center">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-6 border-b">Date</th>
                <th className="py-3 px-6 border-b">Channel</th>
                <th className="py-3 px-6 border-b">Recipient</th>
                <th className="py-3 px-6 border-b">Message</th>
                <th className="py-3 px-6 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td className="py-3 px-6 border-b">{user.date}</td>
                  <td className="py-3 px-6 border-b">{user.channel}</td>
                  <td className="py-3 px-6 border-b">{user.recipient}</td>
                  <td className="py-3 px-6 border-b truncate max-w-xs">{user.message}</td>
                  <td className={`py-3 px-6 border-b font-semibold ${user.status === 'Delivered' ? 'text-green-600' : 'text-blue-600'}`}>
                    {user.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-between items-center">
          <span>Showing 1 to {users.length} of 50 total records</span>
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
    </div>
  );
};

export default AdminSMSFacebook;
