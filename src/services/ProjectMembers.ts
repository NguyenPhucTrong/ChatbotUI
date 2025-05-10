import axios from "./Custom_axios";

export const getProjectMembers = (id: number) => {
  return axios.get(`/api/members/${id}`);
};

export const addMemberToProject = (
  projectId: number,
  userId: number,
  userole: string
) => {
  return axios.post(`/api/members/`, {
    IdProject: projectId,
    IdUser: userId, // Thay đổi payload để phù hợp với backend
    UserRole: userole,
  });
};

export const removeMemberFromProject = (userId: number) => {
  return axios.delete(`/api/members/${userId}`);
};
