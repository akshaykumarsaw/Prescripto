import { Resend } from "resend";

let resend;
if (process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
}

export const sendEmail = async (to, subject, html) => {
    if (!resend) {
        console.log("Resend API Key is missing. Skipping email send:", subject);
        return;
    }

    try {
        const data = await resend.emails.send({
            from: "Prescripto <onboarding@resend.dev>", // Replace with your tested domain when available
            to: [to],
            subject: subject,
            html: html,
        });
        console.log("Email sent successfully", data);
        return data;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};
