import React from 'react';
import { useNotification } from '../context/NotificationProvider';

const AdminSMSFacebook = () => {
  const { notifications, addNotification, clearNotifications } = useNotification();

  return (
    <div className="container max-w-4xl mx-auto px-4 mt-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Notification Management</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => addNotification('This is a new notification!')}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Notification
          </button>
          <button
            onClick={clearNotifications}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Clear All Notifications
          </button>
        </div>
      </div>

      {/* Notification History */}
      <div className="bg-white border border-gray-200 rounded-md p-4">
        <h2 className="text-lg font-semibold mb-2">Notification History</h2>
        {notifications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 text-center">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-6 border-b">Date</th>
                  <th className="py-3 px-6 border-b">Message</th>
                </tr>
              </thead>
              <tbody>
                {notifications.map((notification) => (
                  <tr key={notification.id}>
                    <td className="py-3 px-6 border-b">
                      {new Date(notification.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-6 border-b">{notification.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center mt-4">No notifications available.</p>
        )}
      </div>
    </div>
  );
};

export default AdminSMSFacebook;