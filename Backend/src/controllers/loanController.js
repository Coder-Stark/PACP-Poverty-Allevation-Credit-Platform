import Loan from '../models/LoanModel.js';
import User from '../models/UserModel.js';

const getInterestRateByTenure = (tenureInMonths)=>{
    if(tenureInMonths >= 24) return 17.0;
    if(tenureInMonths >= 18) return 16.5;
    if(tenureInMonths >= 12) return 16.0;
    if(tenureInMonths >= 6) return 15.5;
    return 15;
}

const generateRepaymentSchedule = (amount, interestRate, tenureInMonths, startDate = new Date())=>{
    const repaymentSchedule = [];
    const p = amount;        
    const r = interestRate;                  
    const n = tenureInMonths;

    //emi calculation
    const totalInterest = (p * r * n) / (12 * 100);
    const totalRepayment = p + totalInterest;
    const EMI = totalRepayment / n;

    for(let i = 1; i <= n;  i++){
        const dueDate = new Date(startDate);
        dueDate.setMonth(startDate.getMonth() + i);

        repaymentSchedule.push({
            dueDate,
            amountDue: parseFloat(EMI.toFixed(2)),       //round to 2 decimals
            status: 'due'
        })
    }
    return repaymentSchedule;
};
const getISTDate = ()=>{
    const now = new Date();
    now.setMinutes(now.getMinutes() + 330);
    return now;
}
//create new Loan
export const createLoan = async(req, res)=>{
    try{
        const {userId, amount, tenureInMonths, loanType,
               personalInfo, occupationDetails, nominee, } = req.body;

        const existingLoan = await Loan.findOne({userId: userId, status: {$nin: ['completed', 'rejected']}});      //not in (nin)
        if(existingLoan) return res.status(400).json({message: "User already has an active Loan that is not completed"});
        
        const interestRate = getInterestRateByTenure(tenureInMonths);

        const startDate = getISTDate();
        const applicationDate = startDate;
        
        const loanApplicationNumber = `LOAN-${startDate.toISOString().split('T')[0].replace(/-/g, '')}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
        const repaymentSchedule = generateRepaymentSchedule(amount, interestRate, tenureInMonths, startDate);

        const newLoan = await Loan.create({
            userId,
            loanApplicationNumber,
            applicationDate,
            amount,
            interestRate,
            tenureInMonths,
            loanType: loanType || 'unsecured',
            status: 'pending',            //initial status
            personalInfo,
            occupationDetails,
            nominee,
            payments: [],
            repaymentSchedule,
            lateFeesPenalty: {amount: 0}
        });

        await User.findByIdAndUpdate(userId, {hasLoan: true});       //update hasLoan
        res.status(201).json(newLoan);
    }catch(error){
        res.status(500).json({message: "Error Creating Loan", error: error.message});
    }
}