import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { handleSuccess, handleError } from '../../utils';

function AdminUserProfile() {
    const {id} = useParams();            //userId passed in route
    const [user, setUser] = useState(null);
    const [rd, setRD] = useState(null);
    const [amountPerMonth, setAmountPerMonth] = useState('');
    const [loading, setLoading] = useState(false);
    
    const fetchUser = async()=>{
      try{
        const token = localStorage.getItem('token');
        const userRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/user/${id}`, {
            headers: {
                Authorization : `Bearer ${token}`
            }
        });
        setUser(userRes.data);
        
        //if user has RD, fetch RD
        if(userRes.data.hasRD){
          const rdRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/finance/rd/${userRes.data._id}`,{
            headers: {Authorization: `Bearer ${token}`},
          });
          setRD(rdRes.data);
          // setAmountPerMonth(rdRes.data.amountPerMonth);    //pre-fill for update
          setAmountPerMonth('');    
        }else{
          setRD(null);
          setAmountPerMonth('');
        }
      }catch(error){
          console.error({message: "Error Fetching User: ", error: error.message});
      }
    };

    useEffect(()=>{
      fetchUser();
    }, [id]);

    //valid detail enters
    const validateInputs = ()=>{
      const amount = parseFloat(amountPerMonth);
      if(isNaN(amount) || amount <= 0){
        handleError("Please enter Valid positive numbers for RD amount");
        return false;
      }
      return true;
    };

    const handleCreateRd = async()=>{
      if(!validateInputs()) return;

      try{
        setLoading(true);
        const token = localStorage.getItem('token');
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/finance/rd/create`, {
          userId: user._id,
          amountPerMonth: parseFloat(amountPerMonth),
        },{
          headers: {Authorization: `Bearer ${token}`},
        });
        handleSuccess("RD Created Successfully");
        fetchUser();
      }catch(err){
        console.error("Failed to Create RD: ", err.message);
        handleError("Error Creating RD");
      }finally{
        setLoading(false);
      }
    };

    const handleUpdateRd = async ()=>{
      if(!validateInputs()) return;

      try{
        setLoading(true);
        const token = localStorage.getItem('token');
        await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/finance/rd/update/${user._id}`, {
          amountPerMonth: parseFloat(amountPerMonth),
        },{
          headers: {
            Authorization: `Bearer ${token}`
          },
        });
        handleSuccess("RD Updated Successfully");
        fetchUser();
      }catch(err){
        console.error("Failed to Update RD : ", err.message);
        alert("Failed to Update RD");
      }finally{
        setLoading(false);
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
            <p><span className="font-semibold">Has RD:</span> {user.hasRD ? "Yes" : "No"}</p>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center mb-8">Deposites</h1>        

        <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
          {/* Conditionally Render RD Update or Create RD */}
          {user?.hasRD ? (
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Recurring Deposit (RD)</h2>
              <div className="space-y-4 text-gray-700">
                <p><span className="font-semibold">Application No:</span> {rd?.applicationNumber}</p>
                <p><span className="font-semibold">Total Invested Amount:</span> ₹{rd?.totalInvestedAmount}</p>
                <p><span className="font-semibold">Current Investment Value:</span> ₹{rd?.currentInvestmentValue}</p>
                <p><span className="font-semibold">Amount Per Month</span> ₹{rd?.amountPerMonth}</p>
                <p><span className="font-semibold">Last Deposite Date:</span> {new Date(rd?.lastDepositeDate).toLocaleDateString()}</p>
                <p><span className="font-semibold">Total Deposited RDs:</span> {rd?.rdCount}</p>
          
                <div>
                  <label className="block font-semibold mb-1">Amount Per Month (₹):</label>
                  <input type="number" placeholder="Enter monthly amount" className="w-full p-2 border rounded-lg" 
                    value={amountPerMonth} onChange={(e)=> setAmountPerMonth(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold cursor-pointer"
                  onClick={handleUpdateRd}
                >
                  Update RD
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Create Recurring Deposit (RD)</h2>
              <div className="space-y-4 text-gray-700">
                <div>
                  <label className="block font-semibold mb-1">Amount Per Month (₹):</label>
                  <input type="number" placeholder="Enter new Monthly amount" className="w-full p-2 border rounded-lg" 
                    value={amountPerMonth} onChange={(e)=> setAmountPerMonth(e.target.value)}
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

          {/* Conditionally Render FD Update or Create FD */}
          {user?.hasRD ? (
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Recurring Deposit (RD)</h2>
              <div className="space-y-4 text-gray-700">
                <p><span className="font-semibold">Application No:</span> {rd?.applicationNumber}</p>
                <p><span className="font-semibold">Total Invested Amount:</span> ₹{rd?.totalInvestedAmount}</p>
                <p><span className="font-semibold">Current Investment Value:</span> ₹{rd?.currentInvestmentValue}</p>
                <p><span className="font-semibold">Amount Per Month</span> ₹{rd?.amountPerMonth}</p>
                <p><span className="font-semibold">Last Deposite Date:</span> {new Date(rd?.lastDepositeDate).toLocaleDateString()}</p>
                <p><span className="font-semibold">Total Deposited RDs:</span> {rd?.rdCount}</p>
          
                <div>
                  <label className="block font-semibold mb-1">Amount Per Month (₹):</label>
                  <input type="number" placeholder="Enter monthly amount" className="w-full p-2 border rounded-lg" 
                    value={amountPerMonth} onChange={(e)=> setAmountPerMonth(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold cursor-pointer"
                  onClick={handleUpdateRd}
                >
                  Update RD
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Create Recurring Deposit (RD)</h2>
              <div className="space-y-4 text-gray-700">
                <div>
                  <label className="block font-semibold mb-1">Amount Per Month (₹):</label>
                  <input type="number" placeholder="Enter new Monthly amount" className="w-full p-2 border rounded-lg" 
                    value={amountPerMonth} onChange={(e)=> setAmountPerMonth(e.target.value)}
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

        <h1 className="text-3xl font-bold text-center mb-8">Credits</h1>        

        <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
          {/* Conditionally Render LOAN Update or Create LOAN */}
          {user?.hasRD ? (
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Recurring Deposit (RD)</h2>
              <div className="space-y-4 text-gray-700">
                <p><span className="font-semibold">Application No:</span> {rd?.applicationNumber}</p>
                <p><span className="font-semibold">Total Invested Amount:</span> ₹{rd?.totalInvestedAmount}</p>
                <p><span className="font-semibold">Current Investment Value:</span> ₹{rd?.currentInvestmentValue}</p>
                <p><span className="font-semibold">Amount Per Month</span> ₹{rd?.amountPerMonth}</p>
                <p><span className="font-semibold">Last Deposite Date:</span> {new Date(rd?.lastDepositeDate).toLocaleDateString()}</p>
                <p><span className="font-semibold">Total Deposited RDs:</span> {rd?.rdCount}</p>
          
                <div>
                  <label className="block font-semibold mb-1">Amount Per Month (₹):</label>
                  <input type="number" placeholder="Enter monthly amount" className="w-full p-2 border rounded-lg" 
                    value={amountPerMonth} onChange={(e)=> setAmountPerMonth(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold cursor-pointer"
                  onClick={handleUpdateRd}
                >
                  Update RD
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Create Recurring Deposit (RD)</h2>
              <div className="space-y-4 text-gray-700">
                <div>
                  <label className="block font-semibold mb-1">Amount Per Month (₹):</label>
                  <input type="number" placeholder="Enter new Monthly amount" className="w-full p-2 border rounded-lg" 
                    value={amountPerMonth} onChange={(e)=> setAmountPerMonth(e.target.value)}
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