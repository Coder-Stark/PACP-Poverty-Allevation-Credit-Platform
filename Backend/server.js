import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import fileUpload from 'express-fileupload';

import AuthRouter from './src/routes/authRoutes.js';

import adminRoutes from './src/routes/adminRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import rdRoutes from './src/routes/rdRoutes.js';
import fdRoutes from './src/routes/fdRoutes.js';
import loanRoutes from './src/routes/loanRoutes.js';

import printRoutes from './src/routes/printRoutes.js';

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
//for uploading files
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: './tmp',
}))

//EJS setup
app.set('view engine', 'ejs');
app.set('views', './views');

//routes
app.use('/auth', AuthRouter);
//admins
app.use('/api/admin', adminRoutes);
app.use('/api/finance/rd', rdRoutes);      
app.use('/api/finance/fd', fdRoutes);
app.use('/api/finance/loan', loanRoutes);
//user(normal)
app.use('/api/user', userRoutes);
app.use('/api/print', printRoutes);

//should always place for not defined pages
app.use((req, res) => {
    res.status(404).send("<h1>Error 404 : Page Not Found</h1>");
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
