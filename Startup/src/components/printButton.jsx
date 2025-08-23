import { useState } from "react";

const printButton = ({userId, userName})=>{
    const [isGenerating, setIsGenerating] = useState(false);

    const handlePrintProfile = async ()=>{
        try{
            setIsGenerating(true);
            const token = localStorage.getItem('token');
            const BASE_URL = import.meta.env.VITE_BACKEND_URL;
            const url = `${BASE_URL}/api/print/profile/${userId}`;
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
            
            if(res.ok){
                const 
            }
        }
    }
}