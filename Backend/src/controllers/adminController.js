import Users from '../models/UserModel.js';

export const getSingleUserById = async (req, res)=>{
    try{
        const user = await Users.findById(req.params.id).select("-password");
        if(!user) return res.status(404).json({message: "User not Found"});
        res.json(user);
    }catch(err){
        console.error("Error in getSingleUserById", err);
        res.status(500).json({message: "Error Fetching User Data"});
    }
};