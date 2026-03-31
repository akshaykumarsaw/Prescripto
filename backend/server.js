import express from "express";
import cors from "cors";
import "dotenv/config";
import http from 'http';
import { Server } from 'socket.io';
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/userRoute.js";
import arivuRouter from "./routes/arivuRoute.js";
import chatRouter from "./routes/chatRoute.js";
import chatMessageModel from "./models/chatMessageModel.js";
import { startCronJobs } from "./services/cronService.js";
import notificationRouter from "./routes/notificationRoute.js";

// app config
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // allow both admin and client origins
    methods: ["GET", "POST"]
  }
});

const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();
startCronJobs();

// middlewares
app.use(express.json());
app.use(cors());

// api endpoints
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/user", userRouter);
app.use("/api/arivu", arivuRouter);
app.use("/api/chat", chatRouter);
app.use("/api/notifications", notificationRouter);

// Set up io globally for routes to access, though we'll handle chat mostly here
app.set("io", io);

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Join a room specific to an appointment
  socket.on('join_appointment', (appointmentId) => {
    socket.join(appointmentId);
    console.log(`User ${socket.id} joined appointment room: ${appointmentId}`);
  });

  socket.on('send_message', async (data) => {
    try {
      const { appointmentId, senderId, senderModel, text } = data;

      // Save to database
      const newMessage = new chatMessageModel({
        appointmentId,
        senderId,
        senderModel,
        text
      });
      await newMessage.save();

      // Broadcast to everyone in the room (including sender to confirm)
      io.to(appointmentId).emit('receive_message', newMessage);

    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("API WORKING");
});

server.listen(port, () => console.log("Server started", port));
