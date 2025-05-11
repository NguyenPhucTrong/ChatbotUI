import React, { useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface AvatarUploaderProps {
    avatar: string;
    onAvatarChange: (newAvatar: string) => void;
}

const AvatarUploader: React.FC<AvatarUploaderProps> = ({ avatar, onAvatarChange }) => {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null); // Tạo ref cho input file


    const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            toast.error("Vui lòng chọn một tệp hình ảnh.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET!);
        formData.append("folder", "avatar");

        try {
            setIsUploading(true);
            const response = await axios.post(import.meta.env.VITE_CLOUDINARY_URL!, formData);
            const imageUrl = response.data.secure_url;
            onAvatarChange(imageUrl); // Gọi callback để cập nhật avatar
            toast.success("Cập nhật ảnh đại diện thành công!");

            // Reset input file sau khi upload thành công
            if (fileInputRef.current) {
                fileInputRef.current.value = ""; // Reset giá trị của input file
            }
        } catch (error) {
            console.error("Lỗi khi tải lên ảnh đại diện:", error);
            toast.error("Không thể tải lên ảnh đại diện. Vui lòng thử lại.");
        } finally {
            setIsUploading(false);
        }
    };

    console.log("Environment Variables:", import.meta.env);


    return (
        <div className="flex flex-col items-center justify-center">
            <img
                src={avatar}
                alt="Avatar"
                className="w-24 h-24 rounded-full shadow-md"
            />
            <input
                ref={fileInputRef} // Gán ref cho input file
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="mt-4 cursor-pointer text-center"
                disabled={isUploading}
            />
            {isUploading && <p className="text-sm text-gray-500 mt-2">Đang tải lên...</p>}
        </div>
    );
};

export default AvatarUploader;