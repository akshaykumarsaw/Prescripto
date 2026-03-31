import express from 'express';
import { handleChat, getHistory } from '../controllers/arivuController.js';
import authUser from '../middlewares/authUser.js';

const arivuRouter = express.Router();

arivuRouter.post('/chat', authUser, handleChat);
arivuRouter.get('/history', authUser, getHistory);

export default arivuRouter;
