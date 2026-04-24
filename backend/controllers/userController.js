import validator from "validator";
import bycrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import healthRecordModel from "../models/healthRecordModel.js";
import prescriptionModel from "../models/prescriptionModel.js";
import notificationModel from "../models/notificationModel.js";
import { sendEmail } from "../services/emailService.js";
import razorpay from "razorpay";

// Gateway Initialize
const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
});

// API to register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing Details" });
    }

    // validating email format
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "enter a valid email" });
    }

    // validating strong password
    if (password.length < 8) {
      return res.json({ success: false, message: "enter a strong password" });
    }

    // hashing user password
    const salt = await bycrypt.genSalt(10);
    const hashedPassword = await bycrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new userModel(userData);
    const user = await newUser.save();

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bycrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get user profile data
const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const useData = await userModel.findById(userId).select("-password");

    res.json({ success: true, user: useData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to update user profile
const updateProfile = async (req, res) => {
  try {
    const {
      userId, name, phone, address, dob, gender,
      age, bloodGroup, height, weight,
      dietType, foodAllergies, foodAllergiesDetail, sugarCravings, dailyRoutine,
      fatigueOften, exerciseFrequency, sleepPattern, stressCoping,
      fluFrequency, dailyMedication, dailyMedicationDetail, feeling,
      smokingStatus, alcoholConsumption // retaining previously existing ones if needed, or capturing if mapped
    } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: "Data Missing" });
    }

    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address: JSON.parse(address),
      dob,
      gender,
      age,
      bloodGroup,
      height,
      weight,
      smokingStatus,
      alcoholConsumption,
      dietType,
      foodAllergies,
      foodAllergiesDetail,
      sugarCravings,
      dailyRoutine,
      fatigueOften,
      exerciseFrequency,
      sleepPattern,
      stressCoping,
      fluFrequency,
      dailyMedication,
      dailyMedicationDetail,
      feeling,
      lastUpdatedDate: Date.now()
    });

    if (imageFile) {
      // upload image to cloudinary
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageURL = imageUpload.secure_url;

      await userModel.findByIdAndUpdate(userId, { image: imageURL });
    }

    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to book appointment
const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body;

    const docData = await doctorModel.findById(docId).select("-password");

    if (!docData.available) {
      return res.json({ success: false, message: "Doctor not available" });
    }

    let slots_booked = docData.slots_booked;

    // checking for slot availability
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: "Slot not available" });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime);
    }

    const userData = await userModel.findById(userId).select("-password");

    delete docData.slots_booked;

    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotTime,
      slotDate,
      date: Date.now(),
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    // save new slots data in docData
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    // Send in-app notification
    await new notificationModel({
      userId,
      title: "Appointment Booked",
      message: `Your appointment with Dr. ${docData.name} is confirmed for ${slotDate} at ${slotTime}.`,
      date: Date.now(),
      type: "appointment"
    }).save();

    // Send email notification if user has email
    if (userData.email) {
      await sendEmail(
        userData.email,
        "Appointment Confirmation - Prescripto",
        `<p>Dear ${userData.name},</p>
        <p>Your appointment with <b>Dr. ${docData.name}</b> has been successfully booked.</p>
        <p><b>Date:</b> ${slotDate}<br/><b>Time:</b> ${slotTime}</p>
        <p>Thank you for choosing Prescripto!</p>`
      );
    }

    res.json({ success: true, message: "Appointment Booked" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get user appointments for frontend my-appointments page
const listAppointment = async (req, res) => {
  try {
    const { userId } = req.body;
    const appointments = await appointmentModel.find({ userId });

    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to cancel appointment
const cancelAppointment = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    // verify appointment user
    if (appointmentData.userId !== userId) {
      return res.json({ success: false, message: "Unauthorized action" });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    // releasing doctor slot

    const { docId, slotDate, slotTime } = appointmentData;

    const doctorData = await doctorModel.findById(docId);

    let slots_booked = doctorData.slots_booked;

    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (e) => e !== slotTime
    );

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: "Appointment Cancelled" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to upload health record
const uploadHealthRecord = async (req, res) => {
  try {
    const { userId, title } = req.body;
    const documentFile = req.file;

    if (!title || !documentFile) {
      return res.json({ success: false, message: "Missing title or file" });
    }

    // upload file to cloudinary
    const fileUpload = await cloudinary.uploader.upload(documentFile.path, {
      resource_type: "auto", // accept pdf, image, etc.
    });

    const newRecord = new healthRecordModel({
      userId,
      title,
      fileUrl: fileUpload.secure_url
    });

    await newRecord.save();

    res.json({ success: true, message: "Health Record Uploaded Successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get patient's health records
const getHealthRecords = async (req, res) => {
  try {
    const { userId } = req.body;
    const records = await healthRecordModel.find({ userId }).sort({ date: -1 });

    res.json({ success: true, records });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to delete a patient's health record
const deleteHealthRecord = async (req, res) => {
  try {
    const { userId, recordId } = req.body;
    
    // Find the record
    const record = await healthRecordModel.findOne({ _id: recordId, userId });
    
    if (!record) {
      return res.json({ success: false, message: "Record not found" });
    }

    // Extract Cloudinary public_id from fileUrl
    // Example: https://res.cloudinary.com/dvxxx/image/upload/v1714523/abcbedf.pdf
    try {
      if (record.fileUrl && record.fileUrl.includes('cloudinary.com')) {
        const urlParts = record.fileUrl.split('/');
        const lastPart = urlParts[urlParts.length - 1]; // abcbedf.pdf
        const publicId = lastPart.split('.')[0]; // abcbedf
        
        // Destroy from Cloudinary, best effort flag.
        await cloudinary.uploader.destroy(publicId);
      }
    } catch (cleanUpError) {
      console.log("Cloudinary cleanup failed optionally: ", cleanUpError);
    }
    
    // Delete from DB
    await healthRecordModel.findByIdAndDelete(recordId);
    
    res.json({ success: true, message: "Health Record Deleted Successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get patient's prescriptions
const getPrescriptions = async (req, res) => {
  try {
    const { userId } = req.body;
    const prescriptions = await prescriptionModel.find({ userId }).sort({ date: -1 });

    res.json({ success: true, prescriptions });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to make payment of appointment using razorpay
const paymentRazorpay = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData || appointmentData.cancelled) {
      return res.json({ success: false, message: "Appointment Cancelled or not found" });
    }

    // Creating options for razorpay payment
    const options = {
      amount: appointmentData.amount * 100, // Amount in paise
      currency: "INR",
      receipt: appointmentId,
    };

    // Creation of an order
    const order = await razorpayInstance.orders.create(options);

    res.json({ success: true, order });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to verify payment of razorpay
const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;

    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

    if (orderInfo.status === "paid") {
      await appointmentModel.findByIdAndUpdate(orderInfo.receipt, {
        payment: true,
      });
      res.json({ success: true, message: "Payment Successful" });
    } else {
      res.json({ success: false, message: "Payment Failed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to add a review for a doctor
const addReview = async (req, res) => {
  try {
    const { userId, appointmentId, docId, rating, comment } = req.body;

    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment || appointment.userId !== userId || !appointment.isCompleted) {
      return res.json({ success: false, message: "Cannot add review for this appointment" });
    }
    if (appointment.hasReviewed) {
      return res.json({ success: false, message: "You have already reviewed this appointment" });
    }

    const userData = await userModel.findById(userId).select("name image");
    const ratingNum = Number(rating);

    const review = {
      userId,
      userName: userData.name,
      userImage: userData.image,
      rating: ratingNum,
      comment,
      date: Date.now()
    };

    const doctor = await doctorModel.findById(docId);
    const allReviews = [...(doctor.reviews || []), review];
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await doctorModel.findByIdAndUpdate(docId, {
      reviews: allReviews,
      rating: Math.round(avgRating * 10) / 10
    });

    await appointmentModel.findByIdAndUpdate(appointmentId, { hasReviewed: true });

    res.json({ success: true, message: "Review submitted successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  uploadHealthRecord,
  deleteHealthRecord,
  getHealthRecords,
  getPrescriptions,
  paymentRazorpay,
  verifyRazorpay,
  addReview
};
