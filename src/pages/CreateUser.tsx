import { useNavigate } from 'react-router-dom';
import '../css/CreateUser.css';

const CreateUser = () => {
  const navigate = useNavigate();

  return (
    <div className="create-user-container">
      <h1>Create User</h1>
      <form>
        <label>Name:</label>
        <input type="text" />
        <label>Email:</label>
        <input type="email" />
        <button type="submit">Create</button>
        {/* Thêm nút "Back to Home" */}
        <button
          className="back-to-home-button"
          onClick={() => navigate('/admin')} // Chuyển hướng về trang chính
        >
          Back to Admin
        </button>
      </form>
    </div>
  );
};

export default CreateUser;
