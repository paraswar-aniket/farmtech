import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    product: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }],
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    totalBill: { type: Number, required: true },
    paymentId: { type: String, required: true }, 

}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);


export default Order;
