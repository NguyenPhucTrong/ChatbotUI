import '../css/EditUser.css';
import { useParams } from 'react-router-dom';

const EditUser = () => {
  const { id } = useParams();

  return (
    <div className="edit-user-container">
      <h1>Edit User {id}</h1>
      <form>
        <label>Name:</label>
        <input type="text" />
        <label>Email:</label>
        <input type="email" />
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default EditUser;
