import express from 'express';
import { addToCart, createOrder, customerLogin, getAllProducts, registerCustomer } from '../controllers/customer.controller.js';


const router = express.Router();

router.post('/signup', registerCustomer);

router.post('/signin', customerLogin);

router.get('/products', getAllProducts);

router.get('/addtocart', addToCart);

router.post('/createorder',createOrder);


export default router;


