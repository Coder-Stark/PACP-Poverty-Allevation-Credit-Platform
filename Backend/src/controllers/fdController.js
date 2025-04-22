import FD from '../models/FdModel.js';
import User from '../models/UserModel.js';

const getInterestRateByTenure = (tenureInMonths)=>{
    if(tenureInMonths >= 36) return 8.0;
    if(tenureInMonths >= 30) return 7.5;
    if(tenureInMonths >= 24) return 7.0;
    if(tenureInMonths >= 18) return 6.5;
    if(tenureInMonths >= 12) return 6;
    if(tenureInMonths >= 6) return 5;
    return 2.5;
};

//create new FD
export const createFD = async(req, res)=>{
    try{
        const {userId, depositAmount, tenureInMonths} = req.body;
        const existing = await FD.findOne({userId});
        if(existing) return res.status(400).json({message: "FD Aready Exist"});

        const interestRate = getInterestRateByTenure(tenureInMonths);
        const interestAmount = (depositAmount* interestRate * tenureInMonths) / (100 * 12);         //(P*R*T)/(100*12)
        const maturityAmount = depositAmount + interestAmount;

        const startDate = new Date();
        // Add 5 hours and 30 minutes to convert to IST
        startDate.setMinutes(startDate.getMinutes() + 330); // Convert to IST

        const maturityDate = new Date(startDate);
        maturityDate.setMonth(startDate.getMonth() + tenureInMonths);
        maturityDate.setMinutes(maturityDate.getMinutes() + 330); // Convert to IST

        const applicationNumber = `FD-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

        const newFD = await FD.create({
            userId,
            depositAmount,
            // currentInvestmentValue: depositAmount,
            maturityAmount,
            interestRate,
            tenureInMonths,
            startDate,
            maturityDate,
            applicationNumber,
            fdCount: 1,
        });

        await User.findByIdAndUpdate(userId, {hasFD: true});
        res.status(201).json(newFD);
    }catch(error){
        res.status(500).json({message: "Error Creating FD", error: error.message});
    }
}

//get fd by user
export const getUserFD = async(req, res)=>{
    try{
        const {userId} = req.params;
        const fd = await FD.findOne({userId});
        if(!fd) return res.status(404).json({message: "No FD Found"});

        res.status(200).json(fd);
    }catch(error){
        res.status(500).json({message: "Error Fetching FD", error: error.message});
    }
}


//get fd by application number
export const getFDByApplicationNumber = async(req, res)=>{
    try{
        const {applicationNumber} = req.params;
        const fd = await FD.findOne({applicationNumber});
        if(!fd) return res.status(404).json({message: "No RD Found"});

        res.status(200).json(fd);
    }catch(error){
        res.status(500).json({message: "Error Fetching FD by Application Number"});
    }
}