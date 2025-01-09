import React from 'react';
import '../css/AdminUserTable.css';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa'; // Import icon kính lúp

interface Product {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  uploadAt: string;
}

interface AdminUserTableProps {
  products: Product[];
  searchTerm: string;
  handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDelete: (id: number) => void;
}

const AdminUserTable: React.FC<AdminUserTableProps> = ({ products, searchTerm, handleSearch, handleDelete }) => {
  const navigate = useNavigate();

  const handleEdit = (id: number) => {
    navigate(`/edit-user/${id}`);
  };

  const handleAddUser = () => {
    navigate('/create-user'); // Chuyển hướng đến trang tạo người dùng mới
  };

  return (
    <div className="admin-products">
      <div className="products-header">
        <h2>Users</h2>
        <div className="products-search">
          <input type="text" placeholder="Search" value={searchTerm} onChange={handleSearch} />
          <button>
            <FaSearch /> {/* Icon kính lúp */}
          </button>
        </div>
        {/* Thêm nút "Add New User" trực tiếp vào đây */}
        <button className="add-user-button" onClick={handleAddUser}>
          + Add New User
        </button>
      </div>
      <table className="products-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Created AT</th>
            <th>Upload AT</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>{product.createdAt}</td>
              <td>{product.uploadAt}</td>
              <td>
                <button onClick={() => handleEdit(product.id)}>Edit</button>
                <button onClick={() => handleDelete(product.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUserTable;