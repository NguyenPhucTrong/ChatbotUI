import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import axios from 'axios';

interface UploadedFile {
    id: string;
    name: string;
    size: number;
    uploadDate: string;
    url: string;
}

const UploadFile = () => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const CLOUDINARY_URL = process.env.REACT_APP_CLOUDINARY_URL!;
    const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET!;

    // Xử lý kéo và thả file
    const onDrop = (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setSelectedFiles((prev) => [...prev, ...acceptedFiles]);
            toast.success(`${acceptedFiles.length} file(s) đã được chọn!`);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: true,
        accept: {
            'application/pdf': ['.pdf'],
            'text/plain': ['.txt'],
            'application/json': ['.json'],
        },
    });

    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            toast.error('Vui lòng chọn ít nhất một file để upload!');
            return;
        }

        setIsUploading(true);

        for (const file of selectedFiles) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

            try {
                const response = await axios.post(CLOUDINARY_URL, formData);
                const uploadedFile = {
                    id: response.data.asset_id,
                    name: file.name,
                    size: file.size,
                    uploadDate: new Date().toISOString(),
                    url: response.data.secure_url,
                };

                setUploadedFiles((prev) => [...prev, uploadedFile]);
                toast.success(`File "${file.name}" đã được upload thành công!`);
            } catch (error) {
                console.error('Lỗi khi upload file:', error);
                toast.error(`Không thể upload file "${file.name}".`);
            }
        }

        setSelectedFiles([]);
        setIsUploading(false);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Upload File</h1>

            {/* Drag and Drop Zone */}
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-100'
                    }`}
            >
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p className="text-blue-500">Thả file vào đây...</p>
                ) : (
                    <p className="text-gray-500">
                        Kéo và thả file vào đây hoặc <span className="text-blue-500 underline">chọn file</span>
                    </p>
                )}
            </div>

            {/* Hiển thị danh sách file đã chọn */}
            {selectedFiles.length > 0 && (
                <div className="mt-4">
                    <h2 className="text-lg font-semibold mb-2">File đã chọn:</h2>
                    <ul className="list-disc pl-6 text-sm text-gray-600">
                        {selectedFiles.map((file, index) => (
                            <li key={index}>
                                {file.name} - {(file.size / 1024).toFixed(2)} KB
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Nút Upload */}
            <button
                onClick={handleUpload}
                disabled={isUploading}
                className={`mt-4 px-6 py-2 rounded-lg text-white ${isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'
                    }`}
            >
                {isUploading ? 'Uploading...' : 'Upload'}
            </button>

            {/* Danh sách File đã Upload */}
            <h2 className="text-2xl font-semibold mt-8 mb-4">Uploaded Files</h2>
            <table className="min-w-full bg-white border border-gray-300 rounded shadow">
                <thead>
                    <tr>
                        <th className="px-6 py-4 bg-gray-300 border-b">File Name</th>
                        <th className="px-6 py-4 bg-gray-300 border-b">Size</th>
                        <th className="px-6 py-4 bg-gray-300 border-b">Upload Date</th>
                        <th className="px-6 py-4 bg-gray-300 border-b">URL</th>
                    </tr>
                </thead>
                <tbody>
                    {uploadedFiles.length > 0 ? (
                        uploadedFiles.map((file) => (
                            <tr key={file.id} className="hover:bg-gray-100">
                                <td className="px-6 py-4 text-center border-b">{file.name}</td>
                                <td className="px-6 py-4 text-center border-b">{(file.size / 1024).toFixed(2)} KB</td>
                                <td className="px-6 py-4 text-center border-b">{file.uploadDate}</td>
                                <td className="px-6 py-4 text-center border-b">
                                    <a
                                        href={file.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 underline"
                                    >
                                        View File
                                    </a>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} className="text-center py-4">
                                Không có file nào được upload.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default UploadFile;