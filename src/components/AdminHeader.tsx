import '../css/AdminHeader.css';
import { FaSearch } from 'react-icons/fa'; // Import icon kính lúp

const AdminHeader = () => {
  return (
    <header className="admin-header">
      <div className="header-search">
        <input type="text" placeholder="Search" />
        <button>
          <FaSearch /> {/* Icon kính lúp */}
        </button>
      </div>
      <div className="header-user">
        <button>Profile</button>
        <button>Logout</button>
      </div>
    </header>
  );
};

export default AdminHeader;