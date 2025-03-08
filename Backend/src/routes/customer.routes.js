import express from 'express';
import { addOrder, addToCart, createOrder, customerLogin, getAllProducts, getCartProducts, getOrdersForCustomer, getProductById, registerCustomer } from '../controllers/customer.controller.js';


const router = express.Router();

router.post('/signup', registerCustomer);

router.post('/signin', customerLogin);

router.get('/products', getAllProducts);

router.post('/addtocart', addToCart);

router.post('/createorder',createOrder);

router.post('/addorder',addOrder);

router.get('/getmyorder',getOrdersForCustomer);

router.get("/products/:productId", getProductById);

router.get('/getcart',getCartProducts);

export default router;


