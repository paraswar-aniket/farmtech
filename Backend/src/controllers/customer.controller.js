import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import Product from '../models/product.model.js';
import Customer from '../models/customer.model.js';
import Farmer from '../models/farmer.model.js';
import Order from '../models/order.model.js';
import bodyParser from 'body-parser';
import Razorpay from 'razorpay';


const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_ID_KEY,
    key_secret: process.env.RAZORPAY_SECRET_KEY
});


export const getOrdersForCustomer = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }

        const customerId = decoded.id; 

        const orders = await Order.find({ to: customerId }).select("-__v");

        const processedOrders = await Promise.all(
            orders.map(async (order) => {
                const farmer = await Farmer.findById(order.from).select("_id name email");
                const products = await Product.find({ _id: { $in: order.product } }).select("_id name");

                return {
                    _id: order._id,
                    farmer: farmer ? { id: farmer._id, name: farmer.name, email: farmer.email } : null,
                    products: products.map(product => ({ id: product._id, name: product.name })),
                    price: order.price,
                    quantity: order.quantity,
                    totalBill: order.totalBill,
                    createdAt: order.createdAt,
                    updatedAt: order.updatedAt,
                };
            })
        );

        return res.status(200).json({ success: true, orders: processedOrders });
    } catch (error) {
        console.error("Error fetching customer's orders:", error);
        return res.status(500).json({ success: false, message: "Error fetching orders" });
    }
};


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

export const getProductById = async (req, res) => {
    try {
        // Extract token from Authorization header
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

        // Extract product ID from request params
        const { productId } = req.params;
        if (!productId) {
            return res.status(400).json({ success: false, message: "Product ID is required" });
        }

        // Find the product in the database
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({
            success: true,
            message: "Product retrieved successfully",
            product,
        });

    } catch (error) {
        console.error("Error fetching product details:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getCartProducts = async (req, res) => {
    try {
        // Extract token from Authorization header
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

        // Extract customer ID from the decoded token
        const customerId = decoded.id;

        // Find customer
        const customer = await Customer.findById(customerId).populate({
            path: "cart",
            select: "_id name price category stock description image",
        });

        if (!customer) {
            return res.status(404).json({ success: false, message: "Customer not found" });
        }

        // Retrieve cart products
        const cartProducts = customer.cart;

        res.status(200).json({
            success: true,
            message: "Cart products retrieved successfully",
            cartProducts,
        });

    } catch (error) {
        console.error("Error fetching cart products:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};






const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};