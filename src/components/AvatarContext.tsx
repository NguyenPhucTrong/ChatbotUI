import React, { createContext, useContext, useState } from "react";

interface AvatarContextProps {
    avatar: string;
    setAvatar: (newAvatar: string) => void;
}

const AvatarContext = createContext<AvatarContextProps | undefined>(undefined);

export const AvatarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [avatar, setAvatar] = useState<string>(""); // Avatar mặc định

    return (
        <AvatarContext.Provider value={{ avatar, setAvatar }}>
            {children}
        </AvatarContext.Provider>
    );
};

export const useAvatar = () => {
    const context = useContext(AvatarContext);
    if (!context) {
        throw new Error("useAvatar must be used within an AvatarProvider");
    }
    return context;
};