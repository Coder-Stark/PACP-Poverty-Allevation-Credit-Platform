import Users from '../models/UserModel.js';
import cloudinary from '../config/cloudinary.js';

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

//upload user image to cloudinary
export const uploadUserImage = async (req, res)=>{
    try{
        const {userId} = req.body;
        const imageFile = req.files?.userImage;
        
        if(!imageFile){
            return res.status(400).json({error: "User image file is required"});
        }

        const imageUpload = await cloudinary.uploader.upload(imageFile.tempFilePath, {
            folder: 'user_images',
        });

        const updatedUser = await Users.findByIdAndUpdate(
            userId,
            {userImage: imageUpload.secure_url},
            {new: true}
        ).select("-password");

        res.status(200).json({message: "User Image Uploaded SuccessFully", user: updatedUser});
    }catch(error){
        console.error("Upload User Image Error : ", error);
        res.status(500).json({error: "Image upload failed"});
    }
}

// Upload only User Signature to Cloudinary
export const uploadUserSignature = async (req, res) => {
  try {
    const { userId } = req.body;
    const signatureFile = req.files?.userSignature;

    if (!signatureFile) {
      return res.status(400).json({ error: 'Signature file is required' });
    }

    const signatureUpload = await cloudinary.uploader.upload(signatureFile.tempFilePath, {
      folder: 'user_signatures',
    });

    const updatedUser = await Users.findByIdAndUpdate(
      userId,
      { userSignature: signatureUpload.secure_url },
      { new: true }
    ).select("-password");

    res.status(200).json({
      message: "User signature uploaded successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Upload User Signature Error:", error);
    res.status(500).json({ error: "Signature upload failed" });
  }
};