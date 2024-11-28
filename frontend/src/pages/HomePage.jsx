import React from 'react'
import { useEffect, useState } from 'react'
import GameCard from '../components/GameCard'

const HomePage = () => {
  const [games, setGames] = useState([]);
  const [offSet, setOffSet] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/games?limit=10&offset=${offSet}`); 
        const data = await response.json();
        setGames(data); 
      } catch (error) {
        console.error('Error fetching API:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGames(); 
  }, [offSet]);

  const nextPage = () => {
    setOffSet(offSet + 10);
  }
  const previousPage = () => {
    setOffSet(offSet - 10);
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className='container m-auto'>
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
      <div className='flex justify-center gap-10 pb-5'>
        {offSet <=0 ? null : <button onClick={() => previousPage()} className='bg-gray-800 hover:bg-gray-600 p-2 rounded w-24 text-center font-bold'>Previous</button>}
        {offSet >=190 ? null : <button onClick={() => nextPage()} className='bg-gray-800 hover:bg-gray-600 p-2 rounded w-24 text-center font-bold'>Next</button>}
      </div>
    </div>
  )
}

export default HomePage