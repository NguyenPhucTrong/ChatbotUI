import axios from './Custom_axios';

export const askQuestion = async (question: {idProject: number, query: string, history?: {role: string, content: string}[]}) => {
    return await axios.post(`/api/ai/ask`, question);
};

// Thêm hàm gọi API write-docs
export const writeDocs = async (idProject: number, file_url: string) => {
    return await axios.post(`/api/ai/write-docs`, null, {
        params: { idProject, file_url }
    });
};