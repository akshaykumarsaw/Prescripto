import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({
    appointmentId: { type: String, required: true, unique: true },
    docId: { type: String, required: true },
    userId: { type: String, required: true },
    medicines: [
        {
            name: { type: String, required: true },
            dosage: { type: String, required: true },
            frequency: { type: String, required: true },
            duration: { type: String, required: true },
            timing: { type: String, required: true }, // e.g., "After Food"
        }
    ],
    instructions: { type: String, default: "" },
    date: { type: Number, required: true, default: Date.now },
});

const prescriptionModel = mongoose.models.prescription || mongoose.model("prescription", prescriptionSchema);
export default prescriptionModel;
