import express from 'express';
import { registerFarmer } from '../controllers/farmer.controller.js';
import { farmerLogin } from '../controllers/farmer.controller.js';

const router = express.Router();

router.post('/signup', registerFarmer);

router.post('/signin', farmerLogin);


export default router;
