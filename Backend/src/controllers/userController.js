import User from '../models/UserModel.js';

export const getUserProfile = async (req, res)=>{
    try{
        const user = await User.findById(req.user._id).select('-password');
        if(!user) return res.status(404).json({message: "User not Found"});
        res.status(200).json(user);
    }catch(err){
        console.error("Error fetching user Profile", err.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}