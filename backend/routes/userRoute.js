import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  uploadHealthRecord,
  getHealthRecords,
  getPrescriptions,
  paymentRazorpay,
  verifyRazorpay,
  addReview
} from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";
import upload from "../middlewares/multer.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

userRouter.get("/get-profile", authUser, getProfile);
userRouter.post(
  "/update-profile",
  upload.single("image"),
  authUser,
  updateProfile
);
userRouter.post("/book-appointment", authUser, bookAppointment);
userRouter.get("/appointments", authUser, listAppointment);
userRouter.post("/cancel-appointment", authUser, cancelAppointment);

// Health Records & Prescriptions
userRouter.post("/upload-record", authUser, upload.single("document"), uploadHealthRecord);
userRouter.get("/health-records", authUser, getHealthRecords);
userRouter.get("/prescriptions", authUser, getPrescriptions);

// Payment Integration
userRouter.post("/payment-razorpay", authUser, paymentRazorpay);
userRouter.post("/verifyRazorpay", authUser, verifyRazorpay);

// Reviews
userRouter.post("/add-review", authUser, addReview);

export default userRouter;
