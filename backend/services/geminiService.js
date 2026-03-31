import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

export const generateGeminiResponse = async (messages, systemPrompt) => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            console.warn('GEMINI_API_KEY is not configured.');
            return null;
        }
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash', systemInstruction: systemPrompt });

        const history = messages.slice(0, -1).map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
        }));

        const chat = model.startChat({ history });
        const lastMessage = messages[messages.length - 1].content;

        const result = await chat.sendMessage(lastMessage);
        return result.response.text();
    } catch (error) {
        console.error('Gemini API Error:', error.message);
        return null;
    }
};
