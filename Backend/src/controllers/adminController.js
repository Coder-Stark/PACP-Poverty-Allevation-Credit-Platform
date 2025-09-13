import User from '../models/UserModel.js';
import RD from "../models/RdModel.js";
import FD from "../models/FdModel.js";
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

//get me (current user)
export const getUserData = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

//get single user by ID
export const getSingleUserById = async (req, res)=>{
    try{
        const user = await User.findById(req.params.id).select("-password");
        if(!user) return res.status(404).json({message: "User not Found"});
        res.json(user);
    }catch(err){
        console.error("Error in getSingleUserById", err);
        res.status(500).json({message: "Error Fetching User Data"});
    }
};

// Fetch All User 
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({role: "user"}).select("-password");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

//Fetch All Admins
export const getAllAdmins = async (req, res) => {
    try {
        const users = await User.find({role: "admin"}).select("-password");
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
        //check size limit: 100KB
        const MAX_IMAGE_SIZE = 100*1024;
        if(imageFile.size > MAX_IMAGE_SIZE){
            return res.status(400).json({error: "Image size exceeds 100 KB limit"});
        }

        const imageUpload = await cloudinary.uploader.upload(imageFile.tempFilePath, {
            folder: 'user_images',
        });

        //delete temp file after upload
        fs.unlink(imageFile.tempFilePath, (err)=>{
            if(err) console.error("Failed to delete temp file: ", err);
        })

        const updatedUser = await User.findByIdAndUpdate(
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

    //check size limit : 30 KB
    const MAX_SIGNATURE_SIZE = 30*1024;
    if(signatureFile.size > MAX_SIGNATURE_SIZE){
        return res.status(400).json({error: "Signature size exceeds 30 KB limit"});
    }

    const signatureUpload = await cloudinary.uploader.upload(signatureFile.tempFilePath, {
      folder: 'user_signatures',
    });

    //delete temp file after upload
    fs.unlink(signatureFile.tempFilePath, (err)=>{
        if(err) console.error("Failed to delete temp File : ", err);
    })

    const updatedUser = await User.findByIdAndUpdate(
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

//get FinanceOverview
export const getFinanceOverview = async(req, res)=>{
    try{
        //Active members (role: user + hasRD/hasFD/hasLoan)
        const activeMembers = await User.countDocuments({
            role: "user",
            $or: [{hasRD: true}, {hasFD: true}, {hasLoan: true}],
        });

        //Inactive members (role: user + no hasRD/hasFD/hasLoan)
        const inactiveMembers = await User.countDocuments({
            role: "user",
            hasRD: false,
            hasFD: false,
            hasLoan: false,
        });

        //Total Admins
        const totalAdmins = await User.countDocuments({
            role: "admin",
        });

        
        // RD Calculations 
        const rdCalculations = await RD.aggregate([
            {
                $group: {
                    _id: null, 
                    rdInvestedSum: {$sum: "$totalInvestedAmount"},
                    rdCurrentSum: {$sum: "$currentInvestmentValue"}
                } 
            },
        ]);

        // FD Calculations
        const fdCalculations = await FD.aggregate([
            {
                $group: {
                    _id: null,
                    fdInvestedSum: {$sum: "$depositAmount"},
                    fdMaturitySum: {$sum: "$maturityAmount"}
                }
            }
        ])

        /*
        // Loan Calculations
        const loanCalculations = await Loan.aggregate([
            {
                $match: {
                    status: {
                        $in: ["approved", "active"]
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    loanDisbursedSum: {$sum: "$amount"},
                    loanOutstandingSum: {$sum: "$remainingBalance"}
                }
            }
        ])
        */

        //extract values with defaults (mongoDB aggregation always return array so we have to extract it)
        const rdInvestedSum = rdCalculations[0]?.rdInvestedSum || 0;
        const rdCurrentSum = rdCalculations[0]?.rdCurrentSum || 0;
        const fdInvestedSum = fdCalculations[0]?.fdInvestedSum || 0;
        const fdMaturitySum = fdCalculations[0]?.fdMaturitySum || 0;
        const totalContributions = rdInvestedSum + fdInvestedSum;

        /*
        const loanDisbursedSum = loanCalculations[0]?.loanDisbursedSum || 0;
        const loanOutstandingSum = loanCalculations[0]?.loanOutstandingSum || 0;

        const availableLoanPool = totalContributions - loanDisbursedSum;
        */
        res.json({
            activeMembers,
            inactiveMembers,
            totalAdmins,

            rdInvestedSum,
            rdCurrentSum,
            
            fdInvestedSum,
            fdMaturitySum,
            totalContributions,
            
            /*
            loanDisbursedSum,
            loanOutstandingSum,
            loanRepaidSum: loanDisbursedSum - loanOutstandingSum,

            availableLoanPool
            */
        })

    }catch(err){
        console.error("Error fetching finance overview: ", err);
        res.status(500).json({message: "Getting Finance Detailed Failed"});
    }
}