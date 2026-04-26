import mongoose from "mongoose";

const healthRecordSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    fileUrl: { type: String, required: false }, // Keeping for backwards compatibility
    fileData: { type: Buffer, required: false },
    contentType: { type: String, required: false },
    date: { type: Number, required: true, default: Date.now },
});

const healthRecordModel = mongoose.models.healthRecord || mongoose.model("healthRecord", healthRecordSchema);
export default healthRecordModel;
