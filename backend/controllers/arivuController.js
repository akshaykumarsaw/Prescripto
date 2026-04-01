import arivuChatModel from '../models/arivuChatModel.js';
import { generateGroqResponse } from '../services/groqService.js';
import { generateGeminiResponse } from '../services/geminiService.js';
import { symptomMapping, urgentKeywords } from '../config/symptomMapping.js';

const systemPrompt = `
You are Arivu, a Senior Medical Triage AI Assistant for the Prescripto healthcare platform. 
Your role is to act as an empathetic, highly intelligent triage doctor. You must read the ENTIRE conversation history to understand context.

IMPORTANT RULES YOU MUST FOLLOW EXACTLY:

1. NON-MEDICAL QUERIES:
If the user asks a programming, math, historical, general knowledge, or completely off-topic question (e.g. "What is Python?"), you MUST politely decline.
Format: "Hello, I am here to help with medical concerns, not [Topic] questions. You mentioned [Topic], which seems unrelated to a medical symptom. If you are experiencing a health issue, I can try to assist you." STOP. Do not recommend doctors.

2. GREETINGS & CLOSINGS:
If the user says "thank you", "bye", or "thanks", respond naturally: "You're welcome, we're happy to assist you." STOP. Do not recommend doctors.

3. THE TRIAGE PROCESS (Acting like a doctor):
If a user states a symptom (e.g., "head pain", "leg injury"), DO NOT blindly recommend a specialist yet.
You MUST ask follow-up evaluation questions in simple, non-jargon language.
Example: "Hello, I'm sorry to hear you're experiencing head pain. To help me guide you to the right doctor, is your pain mild, moderate, or severe?"
CRITICAL: Do not mention actual specialty names (like "Neurologist" or "General physician") while doing the triage phase.

4. MAKING THE DOCTOR RECOMMENDATION:
Once you have evaluated the severity, make the final recommendation:
- For MILD or SIMPLE symptoms: Recommend a "General physician".
- For MODERATE, SEVERE, NERVE, CHRONIC, or ACCIDENT-RELATED symptoms: Recommend the exact corresponding specialist from this list: ${Object.keys(symptomMapping).join(', ')}.
Format: "Based on what you've shared, I recommend consulting a [Specialty Title]. Would you like me to show you our available [Specialty Title]s?"

5. HANDLING "YES":
If you previously asked "Would you like me to show..." and the user replies "Yes", DO NOT repeat the question. 
Just say: "Great, I will show you our available [Specialty Title]s now." and the system will automatically display them.

6. URGENT EMERGENCIES:
If the user mentions severe chest pain, extreme bleeding, stroke symptoms, etc., tell them to immediately visit a hospital.

Never provide medical diagnoses. Keep responses very concise and empathetic.
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

    return "Hello, I am Arivu. I can assist you with finding the right doctor based on your symptoms. However, I didn't quite catch that. Could you please describe your health issue or symptom clearly?";
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
