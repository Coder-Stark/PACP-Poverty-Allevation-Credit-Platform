import Users from '../models/UserModel.js';

//get me (current user)
export const getUserData = async (req, res) => {
    try {
        const user = await Users.findById(req.user._id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

//get single user by ID
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

// Fetch All Users 
export const getAllUsers = async (req, res) => {
    try {
        const users = await Users.find({role: "user"}).select("-password");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

//Fetch All Admins
export const getAllAdmins = async (req, res) => {
    try {
        const users = await Users.find({role: "admin"}).select("-password");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};