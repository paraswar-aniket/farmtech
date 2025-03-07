import express from 'express';
import { createProduct, getFarmerProducts, registerFarmer } from '../controllers/farmer.controller.js';
import { farmerLogin } from '../controllers/farmer.controller.js';
import multer from "multer";
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.post('/signup', registerFarmer);

router.post('/signin', farmerLogin);

router.post('/addproduct' , upload.single("image"), createProduct );

router.get('/getproducts', getFarmerProducts);


export default router;


