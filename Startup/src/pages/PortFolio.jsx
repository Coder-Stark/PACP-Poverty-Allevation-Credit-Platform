import axios from 'axios';
import {useEffect, useState} from 'react';

function PortFolio() {
  const [user, setUser] = useState(null);
  const [rd, setRD] = useState(null);
  const [fd, setFD] = useState(null);
  const [loan, setLoan] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const userRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(userRes.data);

      if (userRes.data.hasRD) {
        const rdRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/finance/rd/${userRes.data._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRD(rdRes.data);
      }

      if (userRes.data.hasFD) {
        const fdRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/finance/fd/${userRes.data._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFD(fdRes.data);
      }

      if (userRes.data.hasLoan) {
        const loanRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/finance/loan/${userRes.data._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const loanData = Array.isArray(loanRes.data) ? loanRes.data : [loanRes.data];
        setLoan(loanData);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handlePrint = async()=>{
    try{
      setIsGenerating(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/print/profile/${user._id}`,
        {
          headers: {Authorization: `Bearer ${token}`},
          responseType: "blob",
        }
      );

      //convert blob to object url
      const fileUrl = window.URL.createObjectURL(new Blob([response.data], {type: "application/pdf"}));
      window.open(fileUrl, "_blank");                         //open in new tab
    }catch(err){
      console.error("Error generating PDF: ", err);
    }finally{
      setIsGenerating(false);
    }
  }

  if (!user) return <div>Loading user data...</div>;
  return (
    <div className="p-8 space-y-8">

{/* Data Update Note Section */}
<div className="border border-gray-300 shadow-lg rounded-2xl p-6 w-full max-w-4xl mx-auto mt-6 bg-white">
  <p className="mb-4 text-gray-700">
    <strong>Note:</strong> All your information is maintained and updated by{" "}
    <span className="text-blue-600 font-semibold">Admin only</span>.
  </p>

  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
    <p className="text-gray-600">
      If you have active deposits and credits, your profile
      statement will look like this:
    </p>

    <a
      href="/sample-pdf.pdf"                            // static file in public/
      target="_blank"
      rel="noopener noreferrer"
      className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition"
    >
      View Sample PDF
    </a>
  </div>
</div>


      {/* Profile Section  */}
      <div className="border border-gray-300 shadow-lg rounded-2xl p-8 w-full max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6 border-b pb-2">
          <h1 className="text-3xl font-bold">Your Profile</h1>
          <button
            onClick={handlePrint}
            disabled={isGenerating} // disable while generating
            className={`px-4 py-2 rounded-lg shadow-md text-white ${
              isGenerating
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
            }`}
          >
            {isGenerating ? "Generating..." : "Print Profile"}
          </button>
          </div>

        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="space-y-4 w-full md:w-1/2">
            <p><strong>ID:</strong> {user._id}</p>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p><strong>Has RD:</strong> {user.hasRD ? "Yes" : "No"}</p>
            <p><strong>Has FD:</strong> {user.hasFD ? "Yes" : "No"}</p>
            <p><strong>Has Loan:</strong> {user.hasLoan ? "Yes" : "No"}</p>
          </div>

          <div className="flex flex-col items-center w-full md:w-1/2">
            <div className="w-60 h-60 border border-gray-300 rounded-xl flex items-center justify-center bg-white shadow-md mb-4">
              {user.userImage ? (
                <img
                  src={user.userImage}
                  alt="User"
                  className="object-cover w-full h-full rounded-xl"
                />
              ) : (
                <p className="text-gray-500 text-center">No Image Uploaded</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Deposite sections  */}
      {(rd || fd) ? (
        <>
          <h1 className="text-3xl font-bold text-center mb-8">Deposits Section</h1>    
          <div className="max-w-4xl mx-auto space-y-6">
            
            {rd && (
              <div className="border rounded-xl p-6 shadow">
                <h2 className="text-xl font-bold mb-2">Recurring Deposit (RD)</h2>
                <p><span className="font-semibold">Application No:</span> {rd.applicationNumber}</p>
                <p><span className="font-semibold">Total Invested Amount:</span> ₹{rd.totalInvestedAmount}</p>
                <p><span className="font-semibold">Current Investment Value:</span> ₹{rd.currentInvestmentValue}</p>
                <p><span className="font-semibold">Amount Per Month:</span> ₹{rd.amountPerMonth}</p>
                <p><span className="font-semibold">Last Deposit Date:</span> {new Date(rd.lastDepositeDate).toLocaleDateString()}</p>
                <p><span className="font-semibold">Total Deposited RDs:</span> {rd.rdCount}</p>
              </div>
            )}
      
            {fd && (
              <div className="border rounded-xl p-6 shadow">
                <h2 className="text-xl font-bold mb-2">Fixed Deposit (FD)</h2>
                <p><span className="font-semibold">Application No:</span> {fd.applicationNumber}</p>
                <p><span className="font-semibold">Invested Amount:</span> ₹{fd.depositAmount}</p>
                <p><span className="font-semibold">Maturity Amount:</span> ₹{fd.maturityAmount}</p>
                <p><span className="font-semibold">Interest Rate:</span> {fd.interestRate}%</p>
                <p><span className="font-semibold">Total Duration (in Months):</span> {fd.tenureInMonths}</p>
                <p><span className="font-semibold">Start Date:</span> {new Date(fd.startDate).toLocaleDateString()}</p>
                <p><span className="font-semibold">Maturity Date:</span> {new Date(fd.maturityDate).toLocaleDateString()}</p>
              </div>
            )}
      
          </div>
        </>
      ) : (
        <div className="text-center py-10">
          <h1 className="text-2xl font-bold mb-2">Deposits Section</h1>
          <p className="text-gray-600">No deposits available at the moment.</p>
        </div>
      )}

      {/* Credit Section  */}
      <h1 className="text-3xl font-bold text-center mb-8">Credits Section</h1>  
      {loan && loan.length > 0 ? (
        <div className="border rounded-xl p-6 shadow">
          <h2 className="text-xl font-bold mb-4">Loan Details</h2>
      
          {loan.map((l, i) => {
            const nextDue = l.repaymentSchedule?.find(r => r.status === 'due');
            const emisLeft = l.repaymentSchedule 
              ? l.repaymentSchedule.filter(r => r.status === 'due').length 
              : 0;
          
            return (
              <div key={i} className="mb-6 border-b pb-4 last:border-b-0">
                <p><span className="font-semibold">Application No:</span> {l.loanApplicationNumber || 'N/A'}</p>
                <p><strong>Status:</strong> {l.status || 'N/A'}</p>
                <p><strong>Loan Disbursement Date:</strong> {l.applicationDate ? new Date(l.applicationDate).toLocaleDateString() : 'N/A'}</p>
                <p><strong>Loan Amount:</strong> ₹{l.amount ?? 'N/A'}</p>
                <p><strong>Interest Rate:</strong> {l.interestRate ?? 'N/A'}%</p>
                <p><strong>Total Duration:</strong> {l.tenureInMonths ?? 'N/A'} months</p>
                <p><strong>Loan Type:</strong> {l.loanType || 'N/A'}</p>
                <p><strong>EMI:</strong> ₹{l.repaymentSchedule?.[0]?.amountDue ?? 'N/A'}</p>
                <p><strong>Next Due Date:</strong> {nextDue?.dueDate ? new Date(nextDue.dueDate).toLocaleDateString() : 'All EMIs Paid'}</p>
                <p><strong>EMIs Left:</strong> {emisLeft}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-500">No loan details available</p>
      )}
    </div>
  );
}

export default PortFolio