import { useNavigate } from 'react-router-dom';
import '../css/Setting.css'; // Sử dụng cùng CSS với AdminSidebar

const Setting = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/'); // Chuyển hướng về trang chính khi nhấn Logout
  };

  const handleCustomerClick = () => {
    navigate('/admin'); // Chuyển hướng đến trang Customer
  };

  return (
    <div className="setting-container">
      <aside className="admin-sidebar">
        <div className="sidebar-logo">
          <img src="/src/assets/image/Bilibili_Gaming.png" alt="BLG Logo" />
          <span>+</span>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li><a href="/admin" onClick={(e) => {
              e.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ <a>
              handleCustomerClick(); // Chuyển hướng đến trang Customer
            }}>
              Customer
            </a></li>
            <li><a href="#">Setting</a></li>
          </ul>
        </nav>
        <div className="sidebar-logout">
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      <main className="setting-content">
        <h1>Settings</h1>
        <div className="setting-sections">
          <section className="setting-section">
            <h2>Account Settings</h2>
            <div className="setting-item">
              <label>Username</label>
              <input type="text" placeholder="Enter your username" />
            </div>
            <div className="setting-item">
              <label>Email</label>
              <input type="email" placeholder="Enter your email" />
            </div>
            <button className="save-button">Save Changes</button>
          </section>

          <section className="setting-section">
            <h2>Notification Settings</h2>
            <div className="setting-item">
              <label>Enable Email Notifications</label>
              <input type="checkbox" />
            </div>
            <div className="setting-item">
              <label>Enable Push Notifications</label>
              <input type="checkbox" />
            </div>
          </section>

          <section className="setting-section">
            <h2>Security Settings</h2>
            <div className="setting-item">
              <label>Change Password</label>
              <input type="password" placeholder="Enter new password" />
            </div>
            <div className="setting-item">
              <label>Confirm Password</label>
              <input type="password" placeholder="Confirm new password" />
            </div>
            <button className="save-button">Update Password</button>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Setting;