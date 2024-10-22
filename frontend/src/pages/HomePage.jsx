import React from 'react'
import { useEffect, useState } from 'react'
import GameCard from '../components/GameCard'

const HomePage = () => {
  const [games, setGames] = useState([]);
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/games?limit=10&offset=0'); 
        const data = await response.json();
        setGames(data); 
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };
    fetchGames(); 
  }, []);

  return (
    <div className='container m-auto'>
      <div className='flex flex-wrap justify-center gap-10 p-10'>
        {games.map((game) => (
          <GameCard
            gameName={game.game_title}
            imageURL={game.game_image_url}
          />
        ))}
      </div>
    </div>
  )
}

export default HomePage