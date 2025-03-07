import Farmer from '../models/farmer.model.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

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
        token: generateToken(farmer._id),
      });
  
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
};

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};
