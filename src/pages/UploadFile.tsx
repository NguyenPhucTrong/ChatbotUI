import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import axios from 'axios';
import { getAllProjects } from '../services/ProjectsServices';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  uploadDate: string;
  url: string;
  publicId: string;
  folder: string;
}

interface Project {
  id: number;
  name: string;
}

const UploadFile = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [folderPath, setFolderPath] = useState('');

  const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL!;
  const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET!;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await getAllProjects();
        const projectsData = response.data.data.map((project: any) => ({
          id: project.IdProject,
          name: project.ProjectName,
        }));
        setProjects(projectsData);
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast.error('Failed to load projects');
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      setFolderPath(`projects/${selectedProjectId}`);
    } else {
      setFolderPath('');
    }
  }, [selectedProjectId]);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFiles((prev) => [...prev, ...acceptedFiles]);
      toast.success(`${acceptedFiles.length} file(s) added!`);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/json': ['.json'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
    },
  });

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select at least one file to upload!');
      return;
    }

    if (!selectedProjectId) {
      toast.error('Please select a project first!');
      return;
    }

    setIsUploading(true);

    const uploadPromises = selectedFiles.map(async (file) => {
      const formData = new FormData();
      
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('folder', folderPath);
      
      // Add tags for better organization
      formData.append('tags', `project-${selectedProjectId}`);
      
      // Optionally set public_id (file name in Cloudinary)
      const fileNameWithoutExt = file.name.split('.').slice(0, -1).join('.');
      formData.append('public_id', fileNameWithoutExt);

      try {
        const response = await axios.post(CLOUDINARY_URL, formData);
        const uploadedFile = {
          id: response.data.asset_id,
          name: file.name,
          size: file.size,
          uploadDate: new Date().toISOString(),
          url: response.data.secure_url,
          publicId: response.data.public_id,
          folder: response.data.folder || folderPath,
        };

        setUploadedFiles((prev) => [...prev, uploadedFile]);
        toast.success(`File "${file.name}" uploaded successfully to ${folderPath}!`);
        return uploadedFile;
      } catch (error) {
        console.error('Error uploading file:', error);
        toast.error(`Failed to upload "${file.name}".`);
        return null;
      }
    });

    await Promise.all(uploadPromises);
    setSelectedFiles([]);
    setIsUploading(false);
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeUploadedFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Cloudinary File Upload</h1>

      {/* Project Selection */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Upload Settings</h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
            <select
              value={selectedProjectId || ''}
              onChange={(e) => setSelectedProjectId(Number(e.target.value))}
              className="w-full p-2 border rounded"
            >
              <option value="">Select a project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name} (ID: {project.id})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Folder Path
            </label>
            <input
              type="text"
              value={folderPath}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
            <p className="text-xs text-gray-500 mt-1">
              Files will be uploaded to: {folderPath || 'No project selected'}
            </p>
          </div>
        </div>
      </div>

      {/* Drag and Drop Zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-100'
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-blue-500">Drop files here...</p>
        ) : (
          <p className="text-gray-500">
            Drag and drop files here or <span className="text-blue-500 underline">click to browse</span>
          </p>
        )}
      </div>

      {/* Selected Files Preview */}
      {selectedFiles.length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Selected Files:</h2>
          <ul className="border rounded divide-y">
            {selectedFiles.map((file, index) => (
              <li key={index} className="p-3 flex justify-between items-center">
                <div>
                  <span className="font-medium">{file.name}</span>
                  <span className="text-sm text-gray-500 ml-2">({(file.size / 1024).toFixed(2)} KB)</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSelectedFile(index);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Upload Button */}
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={handleUpload}
          disabled={isUploading || selectedFiles.length === 0 || !selectedProjectId}
          className={`px-6 py-2 rounded-lg text-white ${
            isUploading || selectedFiles.length === 0 || !selectedProjectId
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-700'
          }`}
        >
          {isUploading ? 'Uploading...' : `Upload ${selectedFiles.length} File(s)`}
        </button>
        {selectedFiles.length > 0 && (
          <button
            onClick={() => setSelectedFiles([])}
            className="text-gray-500 hover:text-gray-700"
          >
            Clear Selection
          </button>
        )}
      </div>

      {/* Uploaded Files Table */}
      <h2 className="text-2xl font-semibold mt-8 mb-4">Uploaded Files</h2>
      {uploadedFiles.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded shadow">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-3 text-left">File Name</th>
                <th className="px-4 py-3 text-left">Size</th>
                <th className="px-4 py-3 text-left">Folder</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {uploadedFiles.map((file) => (
                <tr key={file.id} className="hover:bg-gray-50 border-t">
                  <td className="px-4 py-3">
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {file.name}
                    </a>
                  </td>
                  <td className="px-4 py-3">{(file.size / 1024).toFixed(2)} KB</td>
                  <td className="px-4 py-3 font-mono text-sm">{file.folder}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => removeUploadedFile(file.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No files have been uploaded yet.</p>
        </div>
      )}
    </div>
  );
};

export default UploadFile;