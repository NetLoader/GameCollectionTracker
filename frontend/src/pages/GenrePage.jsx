import React from 'react'
import {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import GameCard from '../components/GameCard'

const GenrePage = () => {
    const {id} = useParams();
    const [genre, setGenre] = useState(null);
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGenre = async () => {
            try {
                const resGenre = await fetch(`/api/genres/${id}`);
                const genreData = await resGenre.json();
                setGenre(genreData);

                const resGames = await fetch(`/api/genres/${id}/games`);
                const gamesData = await resGames.json();
                setGames(gamesData);

            } catch (error) {
                console.error('Error fetching API:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchGenre();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className='container m-auto py-20 px-5'>
            <div className='flex flex-col'>
                <h1 className='font-bold text-4xl'>{genre.genre_name}</h1>
                <div className='flex flex-wrap justify-center gap-10 p-10'>
                    {games.map((game) => (
                    <GameCard
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

export default GenrePage