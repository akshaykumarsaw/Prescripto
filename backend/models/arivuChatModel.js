import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const arivuChatSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    messages: [messageSchema],
    startedAt: { type: Date, default: Date.now },
    lastUpdatedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['active', 'closed'], default: 'active' }
});

const arivuChatModel = mongoose.models.arivuChat || mongoose.model('arivuChat', arivuChatSchema);

export default arivuChatModel;
