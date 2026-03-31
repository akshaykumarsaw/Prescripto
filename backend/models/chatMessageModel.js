import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'appointment', required: true },
    senderId: { type: String, required: true }, // Can be userId or docId
    senderModel: { type: String, required: true, enum: ['user', 'doctor'] },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const chatMessageModel = mongoose.models.chatMessage || mongoose.model('chatMessage', chatMessageSchema);
export default chatMessageModel;
