import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const farmerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        state: {
            type: String,
            required: true
        },
        district: {
            type: String,
            required: true
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
        }
    },
    { timestamps: true } // ✅ Adds createdAt & updatedAt fields automatically
);

farmerSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

farmerSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const Farmer = mongoose.model('Farmer', farmerSchema);

export default Farmer;
