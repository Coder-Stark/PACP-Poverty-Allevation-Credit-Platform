const express = require('express');
const app = express();
const cors = require('cors');
const AuthRouter = require('./src/routes/authRoutes');
const userRouters = require('./src/routes/userRoutes');
const connectDB = require('./src/config/db'); // ✅ Import connectDB

require('dotenv').config();

connectDB();  

const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.send('API is running');
});

app.use(express.json()); 
app.use(cors());

//routes
app.use('/auth', AuthRouter);
app.use('/api/users', userRouters);

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
