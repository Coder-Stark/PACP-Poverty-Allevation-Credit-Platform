import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { handleSuccess, handleError } from '../../utils';

function AdminUserProfile() {
    const {id} = useParams();            //userId passed in route
    const [user, setUser] = useState(null);
    //rd details
    const [rd, setRD] = useState(null);
    const [amountPerMonth, setAmountPerMonth] = useState('');
    const [loading, setLoading] = useState(false);

    //fd details
    const [fd, setFD] = useState(null);
    const [fdAmount, setFDAmount] = useState('');
    const [fdTenure, setFDTenure] = useState('');
    
    const fetchUser = async()=>{
      try{
        //fetch simple user from userModel
        const token = localStorage.getItem('token');
        const userRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/user/${id}`, {
            headers: {
                Authorization : `Bearer ${token}`
            }
        });
        setUser(userRes.data);
        
        //if user has RD, fetch RD from rdModel
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

        //if user has FD, fetch FD from fdModel
        if(userRes.data.hasFD){
          const fdRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/finance/fd/${userRes.data._id}`, {
            headers: {Authorization: `Bearer ${token}`}
          });
          setFD(fdRes.data);
        }else{
          setFD(null);
          setFDAmount('');
          setFDTenure('');
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

    const handleCreateFd = async()=>{
      const amount = parseFloat(fdAmount);
      const tenure = parseInt(fdTenure);

      if(isNaN(amount) || amount <= 0 || isNaN(tenure) || tenure <= 0){
        return handleError("Enter valid positive values for FD Fields");
      }

      try{
        setLoading(true);
        const token = localStorage.getItem('token');
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/finance/fd/create`, {
          userId: user._id,
          depositAmount: amount,
          tenureInMonths: tenure,
        },{
          headers: {Authorization: `Bearer ${token}`},
        });
        handleSuccess("Fd Created Successfully");
        fetchUser();
      }catch(err){
        console.error("Failed to Create FD: ", err.message);
        handleError("Error Creating FD");
      }finally{
        setLoading(false);
      }
    }

    const handleImageUpload = async(e)=>{
      const file = e.target.files[0];
      if(!file) return;

      //check max file size is 100kb (100*1024)
      if(file.size > 102400){
        handleError("File  Size must be less than 100 KB");
        return;
      }

      //upload file
      const formData = new FormData();
      formData.append("userImage", file);
      formData.append("userId", user._id);
      try{
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/upload-user-image`, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if(res.ok){
          handleSuccess("Image Uploaded Successfully");
          fetchUser();           //refresh
        }else{
          handleError("Failed to upload Image");
        }
      }catch(error){
        console.error("Error uploading Image : ", error);
        handleError("Something went wrong. Please try again");
      }
    }

    if(!user) return <div>Loading user data...</div>

    return (
      <div className="p-8 space-y-8">
        {/* User Profile */}
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">User Profile</h1>
          
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Left Column : User info */}
            <div className="space-y-4 text-gray-700">
              <p><span className="font-semibold">ID:</span> {user._id}</p>
              <p><span className="font-semibold">Name:</span> {user.name}</p>
              <p><span className="font-semibold">Email:</span> {user.email}</p>
              <p><span className="font-semibold">Phone:</span> {user.phone}</p>
              <p><span className="font-semibold">Has RD:</span> {user.hasRD ? "Yes" : "No"}</p>
              <p><span className="font-semibold">Has FD:</span> {user.hasFD ? "Yes" : "No"}</p>
            </div>

            {/* Right Column: User image */}
            {/* Conditionally render shows images or upload image */}
            {user.userImage ? (
              <img 
                src={user.userImage}
                alt="User Image"
                className='w-full max-w-xs mx-auto rounded-xl shadow-md'
              />
            ) : (
              <div className='text-center border border-dashed border-gray-400 p-4 rounded-lg'>
                <p className='mb-2 text-gray-500'>No User Image uploaded. </p>
                <label className='inline-block bg-purple-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-purple-700'>
                  Upload Image
                  <input type='file' accept='image/*' className='hidden' onChange={handleImageUpload} />
                </label>
              </div>
            )}
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
          {user?.hasFD ? (
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Fixed Deposit (FD)</h2>
              <div className="space-y-4 text-gray-700">
                <p><span className="font-semibold">Application No:</span> {fd?.applicationNumber}</p>
                <p><span className="font-semibold">Invested Amount:</span> ₹{fd?.depositAmount}</p>
                <p><span className="font-semibold">Maturity Amount:</span> ₹{fd?.maturityAmount}</p>
                <p><span className="font-semibold">Interest Rate:</span> {fd?.interestRate} %</p>
                <p><span className="font-semibold">Tenure (Months):</span> {fd?.tenureInMonths}</p>
                <p><span className="font-semibold">Start Date:</span> {new Date(fd?.startDate).toLocaleDateString()}</p>
                <p><span className="font-semibold">Maturity Date:</span> {new Date(fd?.maturityDate).toLocaleDateString()}</p>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Create Recurring Deposit (RD)</h2>
              <div className="space-y-4 text-gray-700">
                <div>
                  <label className="block font-semibold mb-1">Amount(₹):</label>
                  <input type="number" placeholder="Enter Fixed Deposite Amount" className="w-full p-2 border rounded-lg" 
                    value={fdAmount} onChange={(e)=> setFDAmount(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Tenure (in Months):</label>
                  <input type="number" placeholder="Enter Fixed Deposite Tenure" className="w-full p-2 border rounded-lg" 
                    value={fdTenure} onChange={(e)=> setFDTenure(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold cursor-pointer"
                  onClick={handleCreateFd}
                >
                  Create FD
                </button>
              </div>
            </div>
          )}

        </div>

        <h1 className="text-3xl font-bold text-center mb-8">Credits</h1>        
      </div>
    )
}

export default AdminUserProfile