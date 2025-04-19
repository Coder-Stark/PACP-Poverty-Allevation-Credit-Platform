import RD from '../models/RdModel.js';
import User from '../models/UserModel.js';

const FLAT_INTEREST_PERCENT = 1;

//create new RD
export const createRD = async(req, res)=>{
    try{
        const {userId, amountPerMonth} = req.body;

        const existing = await RD.findOne({userId});
        if(existing) return res.status(400).json({message: "RD already exists"});

        const applicationNumber = `RD-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
        const interest = (amountPerMonth * FLAT_INTEREST_PERCENT) / 100;
        const currentValue = amountPerMonth + interest;

        const newRD = await RD.create({
            userId, 
            applicationNumber,
            amountPerMonth,
            interestRate: FLAT_INTEREST_PERCENT,
            totalInvestedAmount: amountPerMonth,
            currentInvestmentValue: currentValue,
            rdCount: 1,
            lastDepositeDate: new Date()   
        });
        //update the hasRD field of User model
        await User.findByIdAndUpdate(userId, {hasRD: true}); 
        res.status(201).json(newRD);
    }catch(error){
        res.status(500).json({message: "Error creating RD", error: error.message});
    }
};

//update RD (new Deposite)
export const updateRD = async(req, res)=>{
    try{
        const {userId} = req.params;
        const {amountPerMonth} = req.body;

        const rd = await RD.findOne({userId});
        if(!rd) return res.status(404).json({message: 'RD not found'});

        const interest = (amountPerMonth * FLAT_INTEREST_PERCENT) / 100;
        const totalGain = amountPerMonth + interest;

        rd.rdCount += 1;
        rd.totalInvestedAmount += amountPerMonth;
        rd.currentInvestmentValue += totalGain;
        rd.lastDepositeDate = new Date();

        await rd.save();
        res.status(200).json(rd);
    }catch(error){
        res.status(500).json({message: "Error updating RD", error : error.message});
    }
};

//get rd by user
export const getUserRD = async (req, res)=>{
    try{
        const {userId} = req.params;
        const rd = await RD.findOne({userId});
        if(!rd) return res.status(404).json({message: "No RD Found"});
        
        res.status(200).json(rd);
    }catch(error){
        res.status(500).json({message: "Error Fetching RD", error : error.message});
    }
}

//get rd by application number
export const getRDByApplicationNumber = async(req, res)=>{
    try{
        const {applicationNumber} = req.params;
        const rd = await RD.findOne({applicationNumber});
        if(!rd) return res.status(404).json({message: "No RD Found"});

        res.status(200).json(rd);
    }catch(error){
        res.status(500).json({message: "Error Fetching RD by application Number", error : error.message});
    }
}
// //get all RDs
// export const getAllRDs = async(req, res)=>{
//     try{
//         const rds = await RD.find()
//     }
// }