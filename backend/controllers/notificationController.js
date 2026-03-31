import notificationModel from "../models/notificationModel.js";

// Get notifications for a user/doctor
export const getNotifications = async (req, res) => {
    try {
        const id = req.body.userId || req.body.docId;
        const notifications = await notificationModel.find({ userId: id }).sort({ date: -1 });
        res.json({ success: true, notifications });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
    try {
        const { notificationId } = req.body;
        await notificationModel.findByIdAndUpdate(notificationId, { isRead: true });
        res.json({ success: true, message: "Marked as read" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Clear all notifications
export const clearNotifications = async (req, res) => {
    try {
        const id = req.body.userId || req.body.docId;
        await notificationModel.deleteMany({ userId: id });
        res.json({ success: true, message: "Notifications cleared" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};
