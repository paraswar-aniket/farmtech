import express from 'express';
import { addOrder, addToCart, createOrder, customerLogin, getAllProducts, getOrdersForCustomer, registerCustomer } from '../controllers/customer.controller.js';


const router = express.Router();

router.post('/signup', registerCustomer);

router.post('/signin', customerLogin);

router.get('/products', getAllProducts);

router.get('/addtocart', addToCart);

router.post('/createorder',createOrder);

router.post('/addorder',addOrder);

router.get('/getmyorder',getOrdersForCustomer);


export default router;


