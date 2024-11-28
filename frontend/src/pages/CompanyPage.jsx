import React from 'react'
import {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import GameCard from '../components/GameCard'


const CompanyPage = ({type}) => {
    const {id} = useParams();
    const [company, setCompany] = useState(null);
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const resCompany = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/${type}/${id}`);
                const companyData = await resCompany.json();
                setCompany(companyData);

                const resGames = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/${type}/${id}/games`);
                const gamesData = await resGames.json();
                setGames(gamesData);

            } catch (error) {
                console.error('Error fetching API:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCompany();
    }, [id, type]);

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className='container m-auto py-20 px-5'>
            <div className='flex flex-col'>
                <h1 className='font-bold text-4xl'>{type === "developers" ? company.developer_name : company.publisher_name}</h1>
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

export default CompanyPage