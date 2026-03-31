import chatMessageModel from "../models/chatMessageModel.js";

// Get all messages for a specific appointment
export const getAppointmentMessages = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const messages = await chatMessageModel.find({ appointmentId }).sort({ timestamp: 1 });

        res.json({ success: true, messages });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};
