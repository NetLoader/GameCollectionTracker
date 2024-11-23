import React from 'react'
import { useEffect, useState } from 'react'
import GameCard from '../components/GameCard';

const ProfilePage = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');
    const [status, setStatus] = useState('All Games');
    const [useStatus, setUseStatus] = useState(false);
    const userID = localStorage.getItem('userID');
    const localAccessToken = localStorage.getItem('accessToken');
    const localRefreshToken = localStorage.getItem('refreshToken');

    const getUsername = async () => {
        try {
            const response = await fetch(`/api/users/${userID}`, {
                method: 'GET',
                headers: {'Content-Type': 'application/json', Authorization: `Bearer ${localAccessToken}`}
            });
            const data = await response.json();
            setUsername(data.username);
        } catch (error) {
            console.error('Error fetching API:', error);
        }
    }

    useEffect(() => {
        const fetchUserCollections = async () => {
            setLoading(true);
            let response;
            let url = `/api/userCollections/${userID}`;
            if (useStatus) {
                url = `/api/userCollections/byStatus/${userID}/${status}`;
            }
            try {
                response = await fetch(url, {
                    method: 'GET',
                    headers: {'Content-Type': 'application/json', Authorization: `Bearer ${localAccessToken}`}
                });
                if (response.status === 403) {
                    const newAccessToken = await refreshToken(localRefreshToken);
                    if (newAccessToken) {
                        response = await fetch(`/api/userCollections/${userID}`, {
                            method: 'GET',
                            headers: {'Content-Type': 'application/json', Authorization: `Bearer ${localAccessToken}`}
                        });
                    } else {
                        alert('Session expired. Please log in again.');
                        return;
                    }
                }
                const data = await response.json();
                setGames(data);
            } catch (error) {
                console.error('Error fetching API:', error);
            } finally {
                setLoading(false)
            }
        } 
        fetchUserCollections();
        getUsername();
    }, [status, useStatus]) 

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className='container m-auto py-10 sm:py-20 px-5'>
            <h1 className='font-bold text-4xl mb-10'>{username}'s Game Collection</h1>
            <div className='flex flex-row items-start space-x-1 sm:space-x-5'>
                <button className='items-center text-center w-1/5 border border-gray-500 py-3 text-xs sm:text-xl sm:font-bold bg-gray-800 hover:bg-gray-700 rounded' onClick={() => {setUseStatus(false); setStatus('All Games');}}>
                    ALL GAMES
                </button>
                <button className='items-center text-center w-1/5 border border-gray-500 py-3 text-xs sm:text-xl sm:font-bold bg-gray-800 hover:bg-gray-700 rounded' onClick={() => {setUseStatus(true); setStatus('Completed')}}>
                    COMPLETED
                </button>
                <button className='items-center text-center w-1/5 border border-gray-500 py-3 text-xs sm:text-xl sm:font-bold bg-gray-800 hover:bg-gray-700 rounded' onClick={() => {setUseStatus(true); setStatus('Playing')}}>
                    PLAYING
                </button>
                <button className='items-center text-center w-1/5 border border-gray-500 py-3 text-xs sm:text-xl sm:font-bold bg-gray-800 hover:bg-gray-700 rounded' onClick={() => {setUseStatus(true); setStatus('Plan to Play')}}>
                    Plan to Play
                </button>
                <button className='items-center text-center w-1/5 border border-gray-500 py-3 text-xs sm:text-xl sm:font-bold bg-gray-800 hover:bg-gray-700 rounded' onClick={() => {setUseStatus(true); setStatus('Dropped')}}>
                    DROPPED
                </button>
            </div>
            <div className='mt-5 sm:mt-10 container m-auto'>
                <h1 className='font-bold text-4xl text-center pb-2 border-b-2 border-gray-500'>{status}</h1>
                <div className='flex flex-wrap justify-center gap-5 p-5 sm:gap-10 sm:p-10'>
                    {games.map((game) => (
                        <GameCard
                            key={game.game_id}
                            gameID={game.game_id}
                            gameName={game.game_title}
                            imageURL={game.game_image_url}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ProfilePage