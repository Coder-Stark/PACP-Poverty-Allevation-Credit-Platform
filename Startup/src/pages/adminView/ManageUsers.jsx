import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(()=>{
    const fetchUsers = async()=>{
      try{
        const token = localStorage.getItem('token');
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/allusers`, {
          headers: {
            Authorization : `Bearer ${token}`
          }
        });
        setUsers(res.data);
      }catch(err){
        console.error("Error Fetching Users : ", err);
      }
    }

    fetchUsers();
  }, []);

  const handleViewProfile = (userId)=>{
    navigate(`/admin/user/${userId}`);
  };

  const filteredUsers = users.filter(user=>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())||
    user.phone.includes(search)
  )
  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-10 mx-auto">

        <div className="flex flex-col text-center w-full mb-8">
          <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">All Members</h1>
        </div>

        {/* search  */}
        <div className='mb-6'>
          <input 
            type='text'
            className='w-full p-2 border border-gray-300 rounded'
            placeholder='Search by name, email or phone'
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
          />

        </div>
        {/* all users container  */}
        <div className="flex flex-wrap -m-2">
          {
            filteredUsers.map((user)=>(
              <div key={user._id} className='p-2 lg:w-1/3 md:w-1/2 w-full'>
                <div className='h-full flex items-center border-gray-200 border p-4 rounded-lg'>
                  <img alt="user" className="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4" 
                  src="https://dummyimage.com/80x80" />
                  <div className='flex-grow'>
                    <h2 className='text-gray-900 title-font font-medium'>{user.name}</h2>
                    <p className='text-gray-500'>{user.email}</p>
                    <p className='text-gray-500'>{user.phone}</p>
                    </div>
                    <button 
                      className='ml-4 bg-purple-500 hover:bg-purple-600 text-white px-4 py-1 rounded text-sm'
                      onClick={()=>handleViewProfile(user._id)}
                      >
                      View Profile
                    </button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </section>
  )
}

export default ManageUsers