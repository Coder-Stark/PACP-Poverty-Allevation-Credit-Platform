import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import AuthRouter from './src/routes/authRoutes.js';
import UserRouter from './src/routes/userRoutes.js';

dotenv.config();
const app = express();

connectDB();  

//for testing
app.get('/', (req, res) => {
    res.send('API is running');
});

app.use(express.json()); 
app.use(cors());

//routes
app.use('/auth', AuthRouter);
app.use('/api', UserRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
