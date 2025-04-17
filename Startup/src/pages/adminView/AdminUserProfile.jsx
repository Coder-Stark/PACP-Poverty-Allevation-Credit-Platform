import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

function AdminUserProfile() {
    const {id} = useParams();
    const [user, setUser] = useState(null);

    useEffect(()=>{
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
                console.error("Failed to Fetch User: ", err);
            }
        };
        fetchUser();
    }, [id]);

    if(!user) return <div>Loading user data...</div>
    return (
        <div style={{ padding: '2rem' }}>
            <h2>User Profile</h2>
            <p><strong>ID:</strong> {user._id}</p>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
        </div>
    )
}

export default AdminUserProfile