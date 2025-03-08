import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import Product from '../models/product.model.js';
import Customer from '../models/customer.model.js';
import Order from '../models/order.model.js';
import bodyParser from 'body-parser';
import Razorpay from 'razorpay';


const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_ID_KEY,
    key_secret: process.env.RAZORPAY_SECRET_KEY
});

export const createOrder = async (req, res) => {
    try {
        const amount = req.body.amount * 100; // Convert INR to paise
        const options = {
            amount: amount,
            currency: 'INR',
            receipt: `order_${Date.now()}`
        };

        razorpayInstance.orders.create(options, (err, order) => {
            if (!err) {
                res.status(200).json({
                    success: true,
                    order_id: order.id,
                    amount: amount,
                    key_id: process.env.RAZORPAY_ID_KEY,
                    name: req.body.name,
                    description: req.body.description,
                    email: req.body.email,
                    contact: req.body.contact
                });
            } else {
                res.status(400).json({ success: false, msg: 'Error creating order' });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
};

export const addOrder = async (req, res) => {
    try {
        const { from, to, product, price, quantity, totalBill, paymentId } = req.body;

        if (!from || !to || !product || !price || !quantity || !totalBill || !paymentId) {
            return res.status(400).json({ success: false, message: "All fields are required, including paymentId" });
        }

        const newOrder = new Order({ from, to, product, price, quantity, totalBill, paymentId });
        await newOrder.save();

        res.status(201).json({ success: true, message: "Order placed successfully", order: newOrder });

    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ success: false, message: "Error placing order" });
    }
};



export const registerCustomer = async (req, res) => {
    try {
        const { name, mobile , email, password ,address } = req.body;

        if (!name || !mobile || !email || !password || !address) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const customerExists = await Customer.findOne({ email });
        if (customerExists) {
            return res.status(400).json({ message: "Customer already exists" });
        }

        const customer = await Customer.create({
            name,
            mobile,
            email,
            password,
            address
        });

        const token = jwt.sign(
            { id: customer._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({
            _id: customer._id,
            name: customer.name,
            mobile: customer.mobile,
            email: customer.email,
            address: customer.address,
            success: true,
            message: "Sign Up Succesful",
            token,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const customerLogin = async (req, res) => {
    const { mobile, password } = req.body;

    try {
        const customer = await Customer.findOne({ mobile });

        if (!customer) {
            return res.status(400).json({ message: "Customer not found!" });
        }

        const isMatch = await customer.matchPassword(password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials!" });
        }

        res.json({
            _id: customer._id,
            name: customer.name,
            mobile: customer.mobile,
            email: customer.email,
            success: true,
            message: "Sign In Succesful",
            token: generateToken(customer._id),
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const getAllProducts = async (req, res) => {
    try {
      const products = await Product.find(); 
  
      res.status(200).json({
        success: true,
        count: products.length,
        products,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
}

export const addToCart = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
        }

        const customerId = decoded.id; 
        const { productId } = req.body; 
        if (!productId) {
            return res.status(400).json({ success: false, message: "Product ID is required" });
        }

        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ success: false, message: "Customer not found" });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        if (customer.cart.includes(productId)) {
            return res.status(400).json({ success: false, message: "Product already in cart" });
        }

        customer.cart.push(productId);
        await customer.save();

        res.status(200).json({
            success: true,
            message: "Product added to cart successfully",
            cart: customer.cart,
        });

    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};





const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};