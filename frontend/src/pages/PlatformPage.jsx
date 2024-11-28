import React from 'react'
import {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import GameCard from '../components/GameCard'

const PlatformPage = () => {
    const {id} = useParams();
    const [platform, setPlatform] = useState(null);
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlatform = async () => {
            try {
                const resPlatform = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/platforms/${id}`);
                const platformData = await resPlatform.json();
                setPlatform(platformData);

                const resGames = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/platforms/${id}/games`);
                const gamesData = await resGames.json();
                setGames(gamesData);

            } catch (error) {
                console.error('Error fetching API:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPlatform();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className='container m-auto py-20 px-5'>
            <div className='flex flex-col'>
                <h1 className='font-bold text-4xl'>{platform.platform_name}</h1>
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

export default PlatformPage