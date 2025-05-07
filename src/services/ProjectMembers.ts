import axios from './Custom_axios';

export const getProjectMembers = (projectId: number) => {
    return axios.get(`/api/members/${projectId}`); // Sử dụng đúng endpoint
};

export const addMemberToProject = (projectId: number, userId: number) => {
    return axios.post(`/api/members/`, {
        IdProject: projectId,
        IdUser: userId, // Thay đổi payload để phù hợp với backend
    });
};