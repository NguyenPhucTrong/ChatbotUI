import axios from './Custom_axios';

export const askQuestion = async (question: {idProject: number, query: string}) => {
    return await axios.post(`/api/ai/ask`, question);
};