import cron from "node-cron";
import prescriptionModel from "../models/prescriptionModel.js";
import notificationModel from "../models/notificationModel.js";
import userModel from "../models/userModel.js";
import { sendEmail } from "./emailService.js";

// Run every hour to check for medicine timings
export const startCronJobs = () => {
    cron.schedule("0 * * * *", async () => {
        console.log("Running medicine reminder cron job...");
        try {
            // Logic to find prescriptions where medicine timing matches current time block
            // In a real app, this would be more complex and timezone-aware
            // Here we simulate the daily reminder checking
            const currentHour = new Date().getHours();
            let timing = '';
            if (currentHour >= 7 && currentHour <= 10) timing = 'Morning';
            if (currentHour >= 12 && currentHour <= 15) timing = 'Afternoon';
            if (currentHour >= 19 && currentHour <= 22) timing = 'Night';

            if (timing) {
                const prescriptions = await prescriptionModel.find({
                    "medicines.timing": timing,
                });

                for (const p of prescriptions) {
                    const user = await userModel.findById(p.userId);
                    if (user) {
                        // Find specific medicines
                        const medsToTake = p.medicines.filter(m => m.timing === timing || m.timing === 'Anytime');
                        if (medsToTake.length > 0) {
                            const medNames = medsToTake.map(m => m.name).join(", ");
                            const msg = `Reminder: Please take your ${timing} medicine(s): ${medNames}`;

                            // 1. In-app notification
                            await new notificationModel({
                                userId: user._id,
                                title: "Medicine Reminder",
                                message: msg,
                                date: Date.now(),
                                type: "reminder"
                            }).save();

                            // 2. Email fallback (if user has email)
                            if (user.email) {
                                await sendEmail(
                                    user.email,
                                    "Prescripto - Medicine Reminder",
                                    `<p>Hello ${user.name},</p><p>${msg}</p><p>Stay healthy!<br/>Prescripto Team</p>`
                                );
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Cron job error:", error);
        }
    });
};
