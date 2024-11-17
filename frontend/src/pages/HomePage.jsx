import React from 'react'
import { useEffect, useState } from 'react'
import GameCard from '../components/GameCard'

const HomePage = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('/api/games?limit=200&offset=0'); 
        const data = await response.json();
        setGames(data); 
      } catch (error) {
        console.error('Error fetching API:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGames(); 
  }, []);

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className='container m-auto'>
      <div className='flex flex-wrap justify-center gap-10 p-10'>
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
  )
}

export default HomePage