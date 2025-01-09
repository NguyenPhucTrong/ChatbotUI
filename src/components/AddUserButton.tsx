import React from 'react';
import '../css/AddUserButton.css';

interface AddUserButtonProps {
  onClick: () => void;
}

const AddUserButton: React.FC<AddUserButtonProps> = ({ onClick }) => {
  return (
    <button className="add-user-button" onClick={onClick}>+ Add new user</button>
  );
};

export default AddUserButton;
