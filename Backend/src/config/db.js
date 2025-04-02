const mongoose = require("mongoose");
require("dotenv").config();

const mongo_uri = process.env.MONGO_URI;

const connectDB = async()=>{
    try{
        await mongoose.connect(mongo_uri);
        console.log('MongoDB connected Successfully !!!');
    }catch(err){
        console.error("MongoDb Connection Error : ", err);
        process.exit(1);
    }
}

module.exports = connectDB;