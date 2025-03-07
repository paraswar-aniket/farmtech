import express from 'express';
import { registerFarmer } from '../controllers/farmer.controller.js';

const router = express.Router();

router.post('/signup', registerFarmer);

export default router;
