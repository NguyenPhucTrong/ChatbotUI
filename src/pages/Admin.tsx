import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Admin.css';
import AdminHeader from '../components/AdminHeader';
import AdminSidebar from '../components/AdminSidebar';
import AdminUserTable from '../components/AdminUserTable';

const Admin = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const products = [
    { id: 1, name: 'Tiến Tài', description: 'Tiến Tài', createdAt: '26/10/2024', uploadAt: '28/10/2024' },
    { id: 2, name: 'Tiến Tài 2', description: 'Description 2', createdAt: '27/10/2024', uploadAt: '29/10/2024' },
    { id: 3, name: 'Tiến Tài 3', description: 'Description 3', createdAt: '28/10/2024', uploadAt: '30/10/2024' },
    { id: 4, name: 'Tiến Tài 4', description: 'Description 4', createdAt: '29/10/2024', uploadAt: '31/10/2024' },
    { id: 5, name: 'Tiến Tài 5', description: 'Description 5', createdAt: '30/10/2024', uploadAt: '01/11/2024' },
  ];

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleDelete = (id: number) => {
    // Xử lý xóa sản phẩm ở đây
    console.log('Deleting product with ID:', id);
    alert(`Product with ID ${id} has been deleted.`);
    // Cập nhật danh sách sau khi xóa
  };
  
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="admin-content">
        <AdminHeader />
        <AdminUserTable products={filteredProducts} searchTerm={searchTerm} handleSearch={handleSearch} handleDelete={handleDelete} />
        {/* Back to Home Button */}
        <button
          className="back-to-home-button"
          onClick={() => navigate('/')}
        >
          Back to Home
        </button>
      </main>
    </div>
  );
};

export default Admin;
