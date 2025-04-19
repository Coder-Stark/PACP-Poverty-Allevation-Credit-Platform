import RdModel from "../models/RdModel.js";

//generate a unique application number
function generateApplicationNumber(prefix = "RD"){
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `${prefix}-${date}-${random}`;
}

//create or update RD
export const createOrUpdateRD = async (req, res) => {
  try {
    const { userId, amountPerMonth, interestRate } = req.body;
    // const userId = req.user._id;           //that is admin's id

    let rd = await RdModel.findOne({ userId });
    const now = new Date();

    if (rd) {
      const last = rd.lastDepositeDate || rd.createdAt;
      const lastDate = new Date(last);

      //check if 1 month has passed 
      const monthDiff = (now.getFullYear() - lastDate.getFullYear())*12 + (now.getMonth() - lastDate.getMonth());

      if(monthDiff >= 1){
        rd.rdCount += 1;
        rd.totalInvestedAmount += amountPerMonth;

        //with interest value
        const amountWithInterest = (amountPerMonth + amountPerMonth/100);
        rd.currentInvestmentValue += amountWithInterest;
        
        rd.lastDepositeDate = now;
      }
      
      rd.amountPerMonth = amountPerMonth;
      rd.interestRate = interestRate;
      rd.hasRd = true;
      await rd.save();
      return res.status(200).json({ message: "RD Updated Successfully", data: rd });
    } else {
      // Create
      const applicationNumber = generateApplicationNumber("RD");
      const amountWithInterest = (amountPerMonth + amountPerMonth/100);
      
      const newRD = new RdModel({
        userId,
        amountPerMonth,
        interestRate,
        applicationNumber,
        totalInvestedAmount: amountPerMonth,
        currentInvestmentValue: amountWithInterest,
        rdCount: 1,
        lastDepositeDate: now,
        hasRd: true
      });
      await newRD.save();
      return res.status(201).json({ message: "RD Created Successfully", data: newRD });
    }
  } catch (err) {
    console.error("Create or Update RD Error:", err);
    res.status(500).json({ message: "Failed to process RD" });
  }
};
  

//get RD by application Number
export const getRdByApplicationNumber = async (req, res)=>{
    try{
        const {applicationNumber} = req.params;
        const rd = await RdModel.findOne({applicationNumber});

        if(!rd){
            return res.status(404).json({message: "RD not Found"});
        }

        res.status(200).json(rd);
    }catch(err){
        console.error("Fetch RD Error : ", err);
        res.status(500).json({message: "Error Fetching RD"});
    }
};

//get RD by user
export const getRdByUser = async (req, res)=>{
    try{
        const userId = req.params.userId;
        const rds = await RdModel.find({userId});

        res.status(200).json(rds);
    }catch(err){
        res.status(500).json({message:  "Failed to Fetch user's RDs"});
    }
};