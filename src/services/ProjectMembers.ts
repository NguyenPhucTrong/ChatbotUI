import axios from "./Custom_axios";

export const getProjectMembers = (id: number) => {
  return axios.get(`/api/members/${id}`);
};

export const addMemberToProject = (
  projectId: number,
  userId: number,
  userRole: string
) => {
  return axios.post(`/api/members/`, {
    IdProject: projectId,
    IdUser: userId,
    UserRole: userRole,
  });
};

export const updateProjectMember = (
  memberId: number,
  projectId: number,
  userId: number,
  userRole: string
) => {
  return axios.put(`/api/members/${memberId}`, {
    IdProject: projectId,
    IdUser: userId,
    UserRole: userRole,
  });
};

export const removeMemberFromProject = (userId: number) => {
  return axios.delete(`/api/members/${userId}`);
};