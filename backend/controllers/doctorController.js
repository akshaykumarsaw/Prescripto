import doctorModel from "../models/doctorModel.js";
import bycrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import prescriptionModel from "../models/prescriptionModel.js";
import notificationModel from "../models/notificationModel.js";
import userModel from "../models/userModel.js";
import healthRecordModel from "../models/healthRecordModel.js";
import Groq from "groq-sdk";
import { GoogleGenAI } from "@google/genai";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");
import axios from "axios";

const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;
    const docData = await doctorModel.findById(docId);
    await doctorModel.findByIdAndUpdate(docId, {
      available: !docData.available,
    });
    res.json({ success: true, message: "Availability changed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(["-password", "-email"]);

    res.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for doctor Login
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await doctorModel.findOne({ email });

    if (!doctor) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bycrypt.compare(password, doctor.password);

    if (isMatch) {
      const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get doctor appointments for doctor panel
const appointmentsDoctor = async (req, res) => {
  try {
    const { docId } = req.body;
    const appointments = await appointmentModel.find({ docId });

    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to mark appointment completed for doctor panel
const appointmentComplete = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (appointmentData && appointmentData.docId === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        isCompleted: true,
      });
      return res.json({ success: true, message: "Appointment Completed" });
    } else {
      return res.json({ success: false, message: "Mark Failed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to cancel appointment for doctor panel
const appointmentCancel = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (appointmentData && appointmentData.docId === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        cancelled: true,
      });
      return res.json({ success: true, message: "Appointment Cancelled" });
    } else {
      return res.json({ success: false, message: "Cancellation Failed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get dashboard data for doctor panel
const doctorDashboard = async (req, res) => {
  try {
    const { docId } = req.body;
    const appointments = await appointmentModel.find({ docId });

    let earnings = 0;

    appointments.map((item) => {
      if (item.isCompleted || item.payment) {
        earnings += item.amount;
      }
    });

    let patients = [];

    appointments.map((item) => {
      if (!patients.includes(item.userId)) {
        patients.push(item.userId);
      }
    });

    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get doctor profile for Doctor panel
const doctorProfile = async (req, res) => {
  try {
    const { docId } = req.body;
    const profileData = await doctorModel.findById(docId).select("-password");

    res.json({ success: true, profileData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to update doctor profile data from Doctor panel
const updateDoctorProfile = async (req, res) => {
  try {
    const { docId, fees, address, available } = req.body;

    await doctorModel.findByIdAndUpdate(docId, { fees, address, available });

    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for doctor to create a prescription
const createPrescription = async (req, res) => {
  try {
    const { docId, appointmentId, medicines, instructions } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData || appointmentData.docId !== docId) {
      return res.json({ success: false, message: "Unauthorized or invalid appointment" });
    }

    const prescriptionData = {
      appointmentId,
      docId,
      userId: appointmentData.userId,
      medicines,
      instructions,
      date: Date.now()
    };

    const newPrescription = new prescriptionModel(prescriptionData);
    await newPrescription.save();

    // Mark appointment as completed since prescription is given
    await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true });

    // Send in-app notification to patient
    await new notificationModel({
      userId: appointmentData.userId,
      title: "Prescription Added",
      message: `Dr. ${doctorData.name} has prescribed medicines for your recent appointment. Please check your appointments.`,
      date: Date.now(),
      type: "appointment"
    }).save();

    res.json({ success: true, message: "Prescription created successfully" });
  } catch (error) {
    if (error.code === 11000) {
      return res.json({ success: false, message: "Prescription already exists for this appointment" });
    }
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get a specific prescription
const getPrescription = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;

    const prescription = await prescriptionModel.findOne({ appointmentId, docId });

    if (!prescription) {
      return res.json({ success: false, message: "No prescription found" });
    }

    res.json({ success: true, prescription });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get AI patient summary
const generatePatientSummary = async (req, res) => {
  const { userId } = req.body;

  // 1. Always fetch patient data & records first (so raw tab always works)
  let user = null;
  let healthRecords = [];
  try {
    user = await userModel.findById(userId).select("-password -image");
    if (!user) return res.json({ success: false, message: "User not found" });
    healthRecords = await healthRecordModel.find({ userId });
  } catch (error) {
    return res.json({ success: false, message: "Failed to load patient data." });
  }

  // 2. Process files
  let extractedText = "";
  let imagesForGemini = [];
  for (const record of healthRecords) {
    try {
      const response = await axios.get(record.fileUrl, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(response.data, 'binary');
      const contentType = response.headers['content-type'] || '';
      if (contentType.includes('pdf') || record.fileUrl.toLowerCase().endsWith('.pdf')) {
        const pdfData = await pdfParse(buffer);
        extractedText += `\n--- Document: ${record.title} ---\n${pdfData.text}\n`;
      } else if (contentType.includes('image') || record.fileUrl.match(/\.(jpeg|jpg|png|webp)$/i)) {
        imagesForGemini.push({ inlineData: { data: buffer.toString('base64'), mimeType: contentType || 'image/jpeg' } });
      }
    } catch (err) {
      console.error(`Skipping record "${record.title}": ${err.message}`);
    }
  }

  // 3. Build prompt
  const patientContext = `
    Name: ${user.name}
    Age: ${user.age || 'N/A'}, Gender: ${user.gender || 'N/A'}, Blood Group: ${user.bloodGroup || 'N/A'}
    Height: ${user.height || 'N/A'}, Weight: ${user.weight || 'N/A'}

    LIFESTYLE & RISKS:
    Smoking: ${user.smokingStatus || 'N/A'}
    Alcohol: ${user.alcoholConsumption || 'N/A'}
    Diet: ${user.dietType || 'N/A'}
    Sleep: ${user.sleepPattern || 'N/A'}
    Exercise: ${user.exerciseFrequency || 'N/A'}
    Stress: ${user.stressCoping || 'N/A'}
    Fatigue: ${user.fatigueOften || 'N/A'}
    Sugar Cravings: ${user.sugarCravings || 'N/A'}
    Daily Routine: ${user.dailyRoutine || 'N/A'}
    Flu Frequency: ${user.fluFrequency || 'N/A'}

    MEDICAL VITAL INFO:
    Food Allergies: ${user.foodAllergies === 'Yes' ? (user.foodAllergiesDetail || 'Yes') : 'None'}
    Daily Medication: ${user.dailyMedication === 'Yes' ? (user.dailyMedicationDetail || 'Yes') : 'None'}
    Recent Feelings/Complaints: ${user.feeling || 'None noted.'}

    EXTERNAL MEDICAL RECORDS (PDF text):
    ${extractedText || 'No PDF records provided.'}
  `;

  const promptInstructions = `
    You are an elite clinical assistant for a doctor. Based on the patient data above, generate a concise, premium clinical dashboard in strictly formatted Markdown with these exact sections:
    
    ### 🚨 Chief Complaints
    ### 📊 Critical Vitals & Allergy Flags
    ### 🩺 Lifestyle Risk Summary
    ### 📂 Medical Records Analysis
    
    Be professional, specific, and medically relevant. Use bullet points heavily. Do NOT include generic disclaimers.
  `;

  // 4. AI call — return rawUser/rawRecords even on AI failure
  let summaryResponse = "";
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    if (imagesForGemini.length > 0) {
      const parts = [{ text: patientContext + promptInstructions }, ...imagesForGemini.map(img => img.inlineData)];
      const response = await ai.models.generateContent({ model: 'gemini-1.5-flash', contents: parts });
      summaryResponse = response.text;
    } else {
      const completion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: "You are an expert clinical summarization AI." },
          { role: "user", content: patientContext + promptInstructions }
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.2,
      });
      summaryResponse = completion.choices[0]?.message?.content || "";
    }
  } catch (aiError) {
    console.error("AI Gen Error:", aiError.message);
    summaryResponse = `> ⚠️ AI summary unavailable: ${aiError.message}\n\nPlease check the Raw Lifestyle Form and Attachments tabs for full patient data.`;
  }

  // Always return patient data so the other tabs still work
  res.json({ success: true, summary: summaryResponse, rawUser: user, rawRecords: healthRecords });
};

export {
  changeAvailability,
  doctorList,
  loginDoctor,
  appointmentsDoctor,
  appointmentCancel,
  appointmentComplete,
  doctorDashboard,
  doctorProfile,
  updateDoctorProfile,
  createPrescription,
  getPrescription,
  generatePatientSummary
};
