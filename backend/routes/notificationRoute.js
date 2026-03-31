import express from 'express';
import { getNotifications, markAsRead, clearNotifications } from '../controllers/notificationController.js';
import authUser from '../middlewares/authUser.js';
import authDoctor from '../middlewares/authDoctor.js';

const notificationRouter = express.Router();

notificationRouter.get('/', authUser, getNotifications); // Assumes authUser sets req.body.userId
notificationRouter.post('/read', authUser, markAsRead);
notificationRouter.post('/clear', authUser, clearNotifications);

// Doctor notification routes
notificationRouter.get('/doctor', authDoctor, getNotifications);
notificationRouter.post('/doctor/read', authDoctor, markAsRead);
notificationRouter.post('/doctor/clear', authDoctor, clearNotifications);

export default notificationRouter;
