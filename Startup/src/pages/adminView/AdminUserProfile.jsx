import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

function AdminUserProfile() {
    const {id} = useParams();
    const [user, setUser] = useState(null);
    const [cdAmount, setCDAmount] = useState('');
    const [interestRate, setInterestRate] = useState('');
    
    useEffect(()=>{
        fetchUser();
    }, []);

    const fetchUser = async()=>{
        try{
            const token = localStorage.getItem('token');
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/user/${id}`, {
                headers: {
                    Authorization : `Bearer ${token}`
                }
            });
            setUser(res.data);
        }catch(err){
            console.error("Error Fetching User: ", err);
        }
    };

    const validateInputs = ()=>{
      const amount = parseInt(cdAmount);
      const rate = parseFloat(interestRate);
      if(isNaN(amount) || isNaN(rate) || amount <= 0 || rate <= 0){
        alert("Please enter Valid positive numbers for CD amount and interest Rate");
        return false;
      }
      return true;
    };

    const handleCreateRd = async()=>{
      if(!validateInputs()) return;

      const token = localStorage.getItem('token');
      try{
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/finance/rd`, {
          userId: user._id,
          amountPerMonth: cdAmount,
          interestRate: interestRate,
        },{
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        alert(res.data.message);
        fetchUser();                      //refresh user data
        setCDAmount('');
        setInterestRate('');
      }catch(err){
        console.error("Failed to Create RD : ", err);
        alert("Failed to create RD");
      }
    };

    const handleUpdateRd = async ()=>{
      if(!validateInputs()) return;

      const token = localStorage.getItem('token');
      try{
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/finance/rd`, {
          userId: user._id,
          amountPerMonth: cdAmount,
          interestRate: interestRate,
        },{
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        alert(res.data.message);
        fetchUser();                      //refresh user data
        setCDAmount('');
        setInterestRate('');
      }catch(err){
        console.error("Failed to Update RD : ", err);
        alert("Failed to Update RD");
      }
    }
    if(!user) return <div>Loading user data...</div>

    return (
        <div className="p-8 space-y-8">

            {/* User Profile */}
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">User Profile</h1>
              <div className="space-y-4 text-gray-700">
                <p><span className="font-semibold">ID:</span> {user._id}</p>
                <p><span className="font-semibold">Name:</span> {user.name}</p>
                <p><span className="font-semibold">Email:</span> {user.email}</p>
                <p><span className="font-semibold">Phone:</span> {user.phone}</p>
                <p><span className="font-semibold">Has RD:</span> {user.hasRd ? "Yes" : "No"}</p>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
              
              {/* Conditionally Render RD Info or Create RD */}
              {user.hasRd ? (
                <div className="bg-white shadow-lg rounded-2xl p-8 w-full">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Recurring Deposit (RD)</h2>
                  <div className="space-y-4 text-gray-700">
                    <p><span className="font-semibold">Application No:</span> {user.applicationNo}</p>
                    <p><span className="font-semibold">Total Invested Amount:</span> ₹{user.totalInvested}</p>
                    <p><span className="font-semibold">Current Investment Value:</span> ₹{user.currentValue}</p>
                    <p><span className="font-semibold">Total CD Deposited:</span> ₹{user.totalCD}</p>
              
                    <div>
                      <label className="block font-semibold mb-1">CD (₹):</label>
                      <input type="number" placeholder="Enter CD amount" className="w-full p-2 border rounded-lg" 
                        value={cdAmount} onChange={(e)=> setCDAmount(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Interest Rate (%):</label>
                      <input type="number" placeholder="Enter interest rate" className="w-full p-2 border rounded-lg" 
                        value={interestRate} onChange={(e)=>setInterestRate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-4 mt-6">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold cursor-pointer"
                      onClick={handleUpdateRd}
                    >
                      Update RD
                    </button>
                    <button className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-lg font-semibold">
                      View History
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white shadow-lg rounded-2xl p-8 w-full">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Create Recurring Deposit (RD)</h2>
                  <div className="space-y-4 text-gray-700">
                    <div>
                      <label className="block font-semibold mb-1">CD (₹):</label>
                      <input type="number" placeholder="Enter CD amount" className="w-full p-2 border rounded-lg" 
                        value={cdAmount} onChange={(e)=> setCDAmount(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Interest Rate (%):</label>
                      <input type="number" placeholder="Enter interest rate" className="w-full p-2 border rounded-lg" 
                        value={interestRate} onChange={(e)=> setInterestRate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end mt-6">
                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold cursor-pointer"
                      onClick={handleCreateRd}
                    >
                      Create RD
                    </button>
                  </div>
                </div>
              )}

            </div>
            
        </div>
    )
}

export default AdminUserProfile