import Groq from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();

let groq;
try {
    if (process.env.GROQ_API_KEY) {
        groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    }
} catch (error) {
    console.error("Failed to initialize Groq:", error);
}

export const generateGroqResponse = async (messages, systemPrompt) => {
    try {
        if (!groq) {
            console.warn('Groq client not initialized (check GROQ_API_KEY).');
            return null;
        }

        const formattedMessages = [
            { role: 'system', content: systemPrompt },
            ...messages.map(m => ({ role: m.role, content: m.content }))
        ];

        const chatCompletion = await groq.chat.completions.create({
            messages: formattedMessages,
            model: 'llama-3.3-70b-versatile', // updated to llama 3.3
            temperature: 0.1,
            max_tokens: 500,
        });

        return chatCompletion.choices[0]?.message?.content || null;
    } catch (error) {
        console.error('Groq API Error:', error.message);
        return null; // Signals controller to fallback
    }
};
