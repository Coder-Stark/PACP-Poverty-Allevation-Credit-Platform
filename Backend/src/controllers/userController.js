const User = require("../models/User");

// Get User Data
const getUserData = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

// Fetch All Users (Admin Only)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({role: "user"}).select("-password");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

const getAllAdmins = async (req, res) => {
    try {
        const users = await User.find({role: "admin"}).select("-password");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

module.exports = { getUserData, getAllUsers, getAllAdmins};
