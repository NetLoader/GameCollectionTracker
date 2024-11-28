import React from 'react'
import { useState } from 'react';
import { refreshTokenUtility } from '../../utility/refreshToken';

const SettingPage = () => {
    const [email, setEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    let newAccessToken;

    const changePassword = async (event) => {
        event.preventDefault();
        setMessage('');
        const userID = localStorage.getItem('userID');
        const localAccessToken = localStorage.getItem('accessToken');
        const localRefreshToken = localStorage.getItem('refreshToken');
        let response;
        try {
            response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/users`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json', Authorization: `Bearer ${localAccessToken}`},
                body: JSON.stringify({userID, email, oldPassword, newPassword}),
            });

            if (response.status === 403) {
                newAccessToken = await refreshTokenUtility(localRefreshToken);
                if (newAccessToken) {
                    response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/users`, {
                        method: 'PUT',
                        headers: {'Content-Type': 'application/json', Authorization: `Bearer ${newAccessToken}`},
                        body: JSON.stringify({userID, email, oldPassword, newPassword}),
                    });
                } else {
                    alert('Session expired. Please log in again.');
                    return;
                }
            }

            if (response.ok) {
                setMessage('Password Updated!');
            } else {
                const errorMsg = await response.json();
                setMessage(errorMsg.message);
            }
        } catch (error) {
            console.error('Error updating password', error);
        }
    }


    return (
        <div className='flex items-center justify-center min-h-screen bg-gray-900 text-white'>
            <div className='w-full max-w-sm p-5 bg-gray-800 rounded-lg'> 
                <p className='text-xl font-bold text-center'>Reset your password</p>
                <form onSubmit={changePassword}>
                    <div className='p-1'>
                        <label htmlFor="email" className='block'>Email:</label>
                        <input className='w-full p-1 bg-gray-700 border border-gray-500 rounded' id="email" name="email" type="email" value={email} onChange={(e)=> setEmail(e.target.value)} required  />

                        <label htmlFor="oldPassword" className='block mt-2'>Old Password:</label>
                        <input className='w-full p-1 bg-gray-700 border border-gray-500 rounded' id="oldPassword" name="oldPassword" type="password" value={oldPassword} onChange={(e)=> setOldPassword(e.target.value)} required  />

                        <label htmlFor="newPassword" className='block mt-2'>New Password:</label>
                        <input className='w-full p-1 bg-gray-700 border border-gray-500 rounded' id="newPassword" name="newPassword" type="password" value={newPassword} onChange={(e)=> setNewPassword(e.target.value)} required  />

                        {message === 'Password Updated!' ? <p className="text-blue-500 items-center mt-2">{message}</p> : <p className="text-red-500 items-center mt-2">{message}</p>}

                        <button className='w-full mt-5 py-2 bg-blue-500 rounded font-bold' type='submit'>Reset Password</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SettingPage