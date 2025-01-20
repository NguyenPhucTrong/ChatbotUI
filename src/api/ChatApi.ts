import axios from 'axios';

interface Message {
    sender: "me" | "bot";
    text: string;
}

// Hàm gọi API để gửi câu hỏi tới endpoint /ask
export const getChatBotResponse = async (question: string) => {
    const payload = { 'query': question };
    try {
        const response = await axios.post("https://9a65-34-83-113-166.ngrok-free.app/ask", payload);
        return response.data;
    } catch (error) {
        console.error('Error fetching response:', error);
        throw error;
    }
}