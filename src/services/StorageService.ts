import axios from "./Custom_axios";

// Lấy danh sách file của một project
const getFilesByProject = async (projectId: number) => {
  return await axios.get(`/api/storages/${projectId}`);
};

// Thêm file mới vào database sau khi upload lên cloud
const addFileToProject = async (fileData: {
  IdStorage: number;
  IdProject: number;
  StorageURL: string;
  Filename: string;
  Size: number;
//   UploadDate: string;
}) => {
  return await axios.post('/api/storages/', fileData);
};

// Xóa file khỏi database (và có thể xóa trên cloud nếu cần)
const deleteFile = async (projectId: number) => {
  return await axios.delete(`/api/storages/${projectId}`);
};

export {
  getFilesByProject,
  addFileToProject,
  deleteFile,
};