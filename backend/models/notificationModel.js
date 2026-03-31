import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    date: { type: Number, required: true },
    type: { type: String, default: 'info' } // 'info', 'reminder', 'appointment'
});

const notificationModel =
    mongoose.models.notification ||
    mongoose.model("notification", notificationSchema);

export default notificationModel;
