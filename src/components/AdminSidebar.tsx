import { useNavigate } from 'react-router-dom';
import '../css/AdminSidebar.css';

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/'); // Chuyển hướng về trang chính khi nhấn Logout
  };

  const handleSetting = () => {
    navigate('/setting'); // Chuyển hướng đến trang Setting
  };

  const handleCustomerClick = () => {
    navigate('/admin'); // Chuyển hướng đến trang Customer
  };

  return (
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
          <li><a href="#" onClick={handleSetting}>Setting</a></li> {/* Liên kết đến trang Setting */}
        </ul>
      </nav>
      <div className="sidebar-logout">
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;