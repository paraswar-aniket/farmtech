import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';

import customerRoutes from './routes/customer.routes.js';
import farmerRoutes from './routes/farmer.routes.js';

const app = express();

app.use(express.json());
app.use(cors());

connectDB();

app.use('/api/farmers', farmerRoutes);
app.use('/api/customer', customerRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the Farmer E-Commerce API 🚜');
});

export default app; 
