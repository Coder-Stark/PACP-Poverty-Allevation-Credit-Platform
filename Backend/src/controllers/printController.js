import puppeteer from 'puppeteer';
import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/UserModel.js';
import RdModel from '../models/RdModel.js';
import FdModel from '../models/FdModel.js';
import LoanModel from '../models/LoanModel.js';

import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateProfilePDF = async(req, res)=>{
    try{
        const {userId} = req.params;
        
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        const rdData = await RdModel.find({userId});
        const fdData = await FdModel.find({userId});
        const loanData = await LoanModel.find({userId});

        // Creating data object
        const profileData = {
            user: {
                id: user._id.toString().substring(0, 12) + '...',
                name: user.name,
                email: user.email,
                phone: user.phone || "Not Provided",
                hasRD: rdData.length > 0 ? "Yes": "No",
                hasFD: fdData.length > 0 ? "Yes": "No",
                hasLoan: loanData.length > 0 ? "Yes": "No"
            },
            deposits: {
                rd: rdData,
                fd: fdData
            },
            loans: loanData,
            generatedDate: new Date().toLocaleDateString(),
            generatedTime: new Date().toLocaleTimeString()
        };

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        
        const htmlContent = await ejs.renderFile(path.join(__dirname, '../../views', 'profile.ejs'), profileData);
        
        // ✅ Save generated HTML into a file (for debugging/preview purposes)
        fs.writeFileSync('./generated2.html', htmlContent);

        await page.setContent(htmlContent, {waitUntil: 'domcontentloaded'});
        
        const pdfBuffer = await page.pdf({
            format: 'A4',
            margin: {top: '60px', right: '20px', bottom: '40px', left: '20px'},
            printBackground: true,
            displayHeaderFooter: true,
            headerTemplate: '<div style="text-align: center; font-size: 30px; width: 100%; border-bottom: 1px solid black; padding-bottom: 10px;">🤝 PACP</div>',
            footerTemplate: '<div style="text-align: center; font-size: 10px; width: 100%;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>'
        });
        
        await browser.close();
        // res.contentType("application/pdf");
        // ✅ Set headers so browser can preview PDF
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'inline; filename="profile.pdf"',
        });
        res.send(pdfBuffer);
        
    }catch(err){
        console.log(err);
        res.status(500).send("Error generating PDF");
    }
}

export { generateProfilePDF };