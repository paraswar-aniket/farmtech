import Farmer from '../models/farmer.model.js';
import Product from '../models/product.model.js';
import cloudinary from '../config/cloudinary.js';
import Customer from '../models/customer.model.js';
import Order from '../models/order.model.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();


export const getOrdersForFarmer = async (req, res) => {
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

        const farmerId = decoded.id; 
        
        const orders = await Order.find({ from: farmerId }).select("-__v"); // Remove __v

        // Process orders manually
        
       
        

        const processedOrders = await Promise.all(
            orders.map(async (order) => {
                const customer = await Customer.findById(order.to).select("_id name email");
                const products = await Product.find({ _id: { $in: order.product } }).select("_id name");

                return {
                    _id: order._id,
                    customer: customer ? { name: customer.name} : null,
                    products: products.map(product => ({ name: product.name , image:product.image})),
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
        console.error("Error fetching farmer's orders:", error);
        return res.status(500).json({ success: false, message: "Error fetching orders" });
    }
};

export const createProduct = async (req, res) => {
    try {
        // Extract token from headers
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        // Decode JWT
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }

        const farmerId = decoded.id;

        // Extract product data
        const { name, type, expiryDate, quantity, price, description } = req.body;

        if (!name || !type || !expiryDate || !quantity || !price || !description) {
            return res.status(400).json({ message: "All product fields are required" });
        }

        // Check if an image was uploaded
        if (!req.file) {
            return res.status(400).json({ message: "Product image is required" });
        }

        // Upload to Cloudinary
        const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path);

        if (!cloudinaryResponse || cloudinaryResponse.error) {
            return res.status(400).json({ message: "File upload failed" });
        }

        // Save product to DB
        const product = await Product.create({
            name,
            type,
            expiryDate,
            quantity,
            price,
            description,
            image: cloudinaryResponse.secure_url, 
            farmer: farmerId,
        });

        res.status(201).json({
            product,
            success: true,
            message: "Product Added Succesfully"
        }
        );
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

export const getFarmerProducts = async (req, res) => {
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

        const farmerId = decoded.id;

        const products = await Product.find({ farmer: farmerId });

        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching farmer products:", error);
        res.status(500).json({ message: "Server error", error });
    }
};


export const registerFarmer = async (req, res) => {
    try {
        const { name, state, district, mobile, email, password } = req.body;

        if (!name || !state || !district || !mobile || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const farmerExists = await Farmer.findOne({ email });
        if (farmerExists) {
            return res.status(400).json({ message: "Farmer already exists" });
        }

        const farmer = await Farmer.create({
            name,
            state,
            district,
            mobile,
            email,
            password,
        });

        const token = jwt.sign(
            { id: farmer._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({
            _id: farmer._id,
            name: farmer.name,
            state: farmer.state,
            district: farmer.district,
            mobile: farmer.mobile,
            email: farmer.email,
            success: true,
            message: "Sign Up Succesful",
            token,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const farmerLogin = async (req, res) => {
    const { mobile, password } = req.body;

    try {
        const farmer = await Farmer.findOne({ mobile });

        if (!farmer) {
            return res.status(400).json({ message: "Farmer not found!" });
        }

        const isMatch = await farmer.matchPassword(password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials!" });
        }

        res.json({
            _id: farmer._id,
            name: farmer.name,
            mobile: farmer.mobile,
            email: farmer.email,
            success: true,
            message: "Sign In Succesful",
            token: generateToken(farmer._id),
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const deleteProduct = async (req, res) => {
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
  
      const farmerId = decoded.id;
  
      const { productId } = req.params;
  
      const product = await Product.findById(productId);
  
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      if (product.farmer.toString() !== farmerId) {
        return res.status(403).json({ message: "Unauthorized: Cannot delete this product" });
      }
  
      await product.deleteOne();
  
      res.status(200).json({ message: "Product deleted successfully" , success:true
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Server error", error });
    }
};
  


const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};
