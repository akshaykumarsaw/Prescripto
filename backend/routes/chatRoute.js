import express from 'express';
import { getAppointmentMessages } from '../controllers/chatController.js';

const chatRouter = express.Router();

chatRouter.get('/:appointmentId', getAppointmentMessages);

export default chatRouter;
