import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const appointmentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    docId: { type: String, required: true },
    slotDate: { type: String, required: true },
    slotTime: { type: String, required: true },
    userData: { type: Object, required: true },
    docData: { type: Object, required: true },
    amount: { type: Number, required: true },
    date: { type: Number, required: true },
    cancelled: { type: Boolean, default: false },
    payment: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false }
});

const appointmentModel = mongoose.models.appointment || mongoose.model('appointment', appointmentSchema);
const doctorModel = mongoose.models.doctor || mongoose.model('doctor', new mongoose.Schema({}, { strict: false }));

const fixAppointments = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}`);
        console.log('Connected to MongoDB');

        const doctors = await doctorModel.find({});
        console.log(`Found ${doctors.length} doctors.`);

        const doctorImageMap = {};
        doctors.forEach(doc => {
            doctorImageMap[doc._id.toString()] = doc.image;
        });

        const appointments = await appointmentModel.find({});
        console.log(`Found ${appointments.length} appointments.`);

        let count = 0;
        for (const appt of appointments) {
            const correctImage = doctorImageMap[appt.docId.toString()];
            if (correctImage && appt.docData.image !== correctImage) {
                appt.docData.image = correctImage;
                await appointmentModel.findByIdAndUpdate(appt._id, { docData: appt.docData });
                count++;
                console.log(`Updated image for appointment ${appt._id} (Doctor: ${appt.docData.name})`);
            }
        }

        console.log(`\n✅ Finished updating ${count} appointments to use the correct doctor profile photos!`);
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

fixAppointments();
