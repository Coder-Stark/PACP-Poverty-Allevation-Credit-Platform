import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';

import AuthRouter from './src/routes/authRoutes.js';

import adminRoutes from './src/routes/adminRoutes.js';
import rdRoutes from './src/routes/rdRoutes.js';
import fdRoutes from './src/routes/fdRoutes.js';

dotenv.config();
const app = express();

connectDB();  

//for testing
app.get('/', (req, res) => {
    res.send('API is running');
});

//middlware
app.use(express.json()); 
app.use(cors());

//routes
app.use('/auth', AuthRouter);
//admins
app.use('/api/admin', adminRoutes);
app.use('/api/finance/rd', rdRoutes);          //RD, FD, Loan
app.use('/api/finance/fd', fdRoutes);


//should always place for not defined pages
app.use((req, res) => {
    res.status(404).send("<h1>Error 404 : Page Not Found</h1>");
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
