import mongoose from 'mongoose';


const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['vegetables', 'fruits', 'grains'], required: true },
    expiryDate: { type: Date, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },  // Reference to Farmer
  }, { timestamps: true });


  const Product = mongoose.model('Product', productSchema);
  
  export default Product;
  