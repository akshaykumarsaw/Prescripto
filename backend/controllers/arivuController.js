import arivuChatModel from '../models/arivuChatModel.js';
import { generateGroqResponse } from '../services/groqService.js';
import { generateGeminiResponse } from '../services/geminiService.js';
import { symptomMapping, urgentKeywords } from '../config/symptomMapping.js';

const systemPrompt = `
You are Arivu, an intelligent and empathetic medical AI assistant for the Prescripto healthcare platform.
Your primary role is to listen to the patient's symptoms or questions, and guide them to the right medical specialist.

IMPORTANT RULES you MUST follow:
1. NEVER provide medical diagnoses or prescribe medications.
2. ALWAYS format your response in 4 distinct parts, but do not number them or explicitly label them:
   - Greeting & empathy (e.g. "Hello! I'm sorry to hear you're feeling this way.")
   - Acknowledgment (Briefly restate their symptom)
   - Suggestion (Recommend the specific specialist from the allowed list)
   - Call to Action ("Would you like me to show you our available [Specialist]s?")
3. You must ONLY suggest specialists from this exact list: ${Object.keys(symptomMapping).join(', ')}.
4. If a user asks about an urgent emergency (e.g. chest pain, severe bleeding), tell them to immediately call emergency services or go to the nearest hospital. Do not suggest booking an appointment.
5. Keep your responses short and concise. (Max 3-4 sentences).

Examples of good responses:
"Hello! I'm Arivu. I understand you're experiencing severe headaches. Based on what you've shared, I recommend consulting a Neurologist. Would you like to see our available Neurologists?"
`;

// Helper: Rule-based fallback
const getRuleBasedResponse = (userText) => {
    const text = userText.toLowerCase();

    // Check urgent
    for (const word of urgentKeywords) {
        if (text.includes(word)) {
            return "This Sounds like a medical emergency. Please call emergency services or visit the nearest hospital immediately.";
        }
    }

    // Check keywords
    for (const [specialty, keywords] of Object.entries(symptomMapping)) {
        for (const kw of keywords) {
            if (text.includes(kw)) {
                return `Hello! I'm Arivu. I understand you're experiencing some discomfort. It sounds like a ${specialty} would be best equipped to help you. Would you like to view our available ${specialty}s?`;
            }
        }
    }

    return "Hello! I'm Arivu. I'm here to help, but I'm not quite sure which specialist to recommend based on that. Could you describe your symptoms a bit more clearly, or would you prefer to see our General physicians?";
};

export const handleChat = async (req, res) => {
    try {
        const { messages, chatId } = req.body;
        const userId = req.body.userId;

        if (!messages || messages.length === 0) {
            return res.json({ success: false, message: "No messages provided" });
        }

        const userMessage = messages[messages.length - 1].content;

        let assistantMessageContent = null;

        // 1. Try Groq
        assistantMessageContent = await generateGroqResponse(messages, systemPrompt);

        // 2. Try Gemini (Fallback)
        if (!assistantMessageContent) {
            console.log("Groq failed, trying Gemini...");
            assistantMessageContent = await generateGeminiResponse(messages, systemPrompt);
        }

        // 3. Rule-based Fallback
        if (!assistantMessageContent) {
            console.log("LLMs failed, using rule-based fallback...");
            assistantMessageContent = getRuleBasedResponse(userMessage);
        }

        // Save to DB
        let chat;
        if (chatId) {
            chat = await arivuChatModel.findById(chatId);
            if (chat) {
                chat.messages.push({ role: 'user', content: userMessage });
                chat.messages.push({ role: 'assistant', content: assistantMessageContent });
                chat.lastUpdatedAt = Date.now();
                await chat.save();
            }
        } else {
            // We drop the previous system message if it exists in the payload, but keep proper user/assistant flow
            const validDocs = messages.filter(m => m.role !== 'system');
            chat = new arivuChatModel({
                userId,
                messages: [
                    ...validDocs,
                    { role: 'assistant', content: assistantMessageContent }
                ]
            });
            await chat.save();
        }

        res.json({ success: true, message: assistantMessageContent, chatId: chat._id });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

export const getHistory = async (req, res) => {
    try {
        const { userId } = req.body;
        const chats = await arivuChatModel.find({ userId }).sort({ lastUpdatedAt: -1 });
        res.json({ success: true, chats });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};
