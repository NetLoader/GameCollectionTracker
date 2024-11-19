import React from 'react'
import {useState} from 'react'
import { useNavigate } from 'react-router-dom'

const AddToButton = ({gameID, isLoggedIn}) => {
    const [dropDown, setDropDown] = useState(false);
    const [message, setMessage] = useState('');
    const nav = useNavigate();

    const toggleDropDown = () => {
        setDropDown(!dropDown);
    }

    const addGameToCollection = async (status) => {
        const userID = localStorage.getItem('userID');
        const localAccessToken = localStorage.getItem('accessToken');
        const localRefreshToken = localStorage.getItem('refreshToken');
        let response;
        let newAccessToken;

        try {
            // check if game exist in user collection
            response = await fetch(`/api/userCollections/${userID}/${gameID}`, {
                method: 'GET',
                headers: {'Content-Type': 'application/json', Authorization: `Bearer ${localAccessToken}`}
            })
            if (response.status === 403) {
                newAccessToken = await refreshToken(localRefreshToken);
                if (newAccessToken) {
                    response = await fetch(`/api/userCollections/checkGame`, {
                        method: 'GET',
                        headers: {'Content-Type': 'application/json', Authorization: `Bearer ${localAccessToken}`},
                        body: JSON.stringify({userID, gameID}) 
                    })
                } else {
                    alert('Session expired. Please log in again.');
                    return;
                }
            }
            const game = await response.json();
            // if game in user collection, update game status
            if (game.exist) {
                response = await fetch('/api/userCollections', {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json', Authorization: `Bearer ${localAccessToken}`},
                    body: JSON.stringify({userID, gameID, status})
                });
                if (response.ok) {
                    setMessage('Game status updated!');
                    setTimeout(() => setMessage(''), 2000);
                } else {
                    const errorMsg = await response.json();
                    console.error(errorMsg.message);
                    setTimeout(() => setMessage(''), 2000);
                }
            } else {   // if game does not exist, add game
                response = await fetch('/api/userCollections', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json', Authorization: `Bearer ${localAccessToken}`},
                    body: JSON.stringify({userID, gameID, status}) 
                })
                if (response.ok) {
                    setMessage('Game added!');
                    setTimeout(() => setMessage(''), 2000);
                } else {
                    const errorMsg = await response.json();
                    console.error(errorMsg.message);
                    setTimeout(() => setMessage(''), 2000);
                }
            }
        } catch (error) {
            console.error("Error adding game to collection", error);
        } finally {
            setDropDown(false);
        }
    }

    const toLoginPage = () => {
        nav('/login');
    }

    return (
        <div className='relative'>
            {isLoggedIn ? <button onClick={toggleDropDown} className='rounded bg-gray-800 p-2 font-bold border border-gray-700'>Add To</button> : <button onClick={toLoginPage} className='rounded bg-gray-800 p-2 font-bold border border-gray-700'>Log In</button>}
            
            {dropDown && (
                <div className="flex flex-col absolute mt-1 w-32 right-1 translate-x-8 bg-gray-900 text-white border-2 border-gray-600 rounded shadow-lg z-50">
                    <button onClick={() => addGameToCollection('Completed')} className='block px-4 py-2 font-bold hover:bg-gray-700 rounded'>Completed</button>
                    <button onClick={() => addGameToCollection('Playing')} className='block px-4 py-2 font-bold hover:bg-gray-700 rounded'>Playing</button>
                    <button onClick={() => addGameToCollection('Plan to Play')} className='block px-4 py-2 font-bold hover:bg-gray-700 rounded'>Plan to Play</button>
                    <button onClick={() => addGameToCollection('Dropped')} className='block px-4 py-2 font-bold hover:bg-gray-700 rounded'>Dropped</button>
                </div>
            )}

            {message && <p className="absolute w-44 whitespace-nowrap text-center font-bold text-emerald-400 mt-1 right-0 translate-x-14">{message}</p>}
        </div>
    )
}

export default AddToButton