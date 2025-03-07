import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const customerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        mobile: {
            type: String,
            required: true,
            unique: true,
            match: [/^\d{10}$/, "Invalid mobile number"]
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            match: [/.+@.+\..+/, "Invalid email"]
        },
        password: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        cart: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }]
    },
    { timestamps: true }
);

customerSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

customerSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const Customer = mongoose.model('Custome', customerSchema);

export default Customer;
