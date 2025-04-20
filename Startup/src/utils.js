import {toast }from 'react-toastify';

export const handleSuccess = (msg)=>{
    toast.success(msg);
}

export const handleError = (err)=>{
    toast.error(err);
}
