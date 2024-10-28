import React from 'react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import {Link} from 'react-router-dom';
import GameInfoCard from '../components/GameInfoCard';

const GameInfoPage = () => {
  const {id} = useParams();
  const [game, setGame] = useState(null);
  const [developer, setDeveloper] = useState(null);
  const [publisher, setPublisher] = useState(null);
  const [genre, setGenre] = useState([]);
  const [platform, setPlatform] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const resGame = await fetch(`/api/games/${id}`); 
        const gameData = await resGame.json();
        setGame(gameData); 

        const {developer_id, publisher_id} = gameData;

        if (developer_id) {
          const resDev = await fetch(`/api/developers/${developer_id}`);
          const devData = await resDev.json();
          setDeveloper(devData);
        } else {
          setDeveloper(null);
        }
        
        if (publisher_id) {
          const resPub = await fetch(`/api/publishers/${publisher_id}`);
          const pubData = await resPub.json();
          setPublisher(pubData);
        } else {
          setPublisher(null);
        }

        const resGenre = await fetch(`/api/games/${id}/genres`);
        const genreData = await resGenre.json();
        setGenre(genreData);

        const resPlatform = await fetch(`/api/games/${id}/platforms`);
        const platformData = await resPlatform.json();
        setPlatform(platformData);

      } catch (error) {
        console.error('Error fetching API:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchGame();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className='container m-auto py-20 px-5'>
      <div className='flex flex-row space-x-10 items-start'>
        <div className='flex flex-col items-center w-1/3'>
          <GameInfoCard 
            gameName={game.game_title}
            imageURL={game.game_image_url}
          />
          <div className='pt-5'>
            <button className='rounded bg-gray-800 p-2 font-bold border border-gray-700'>
              Add to
            </button>
          </div>
        </div>
        <div className='flex flex-col w-2/3'>
          <div>
            <h1 className='font-bold text-4xl'>{game.game_title}</h1>
          </div>
          <div className='flex flex-row space-x-5 pt-5'>
            <div className='flex flex-col w-1/2'>
              <p>Release Date: {new Date(game.game_release_date).toLocaleDateString()}</p>
              <p>Developer: {developer ? (
                <Link to={`/developer/${developer.developer_id}`} className='text-blue-400 underline'>{developer.developer_name}</Link>
              ) : (
                <Link to={`/publisher/${publisher.publisher_id}`} className='text-blue-400 underline'>{publisher.publisher_name}</Link>
              )}</p>
              <p>Publisher: {publisher ? (
                <Link to={`/publisher/${publisher.publisher_id}`} className='text-blue-400 underline'>{publisher.publisher_name}</Link>
              ) : (
                <Link to={`/developer/${developer.developer_id}`} className='text-blue-400 underline'>{developer.developer_name}</Link>
              )}</p>
              <p>Genre: {genre.map((genre) => (
                <span key={genre.genre_id}>
                  <Link to={`/genre/${genre.genre_id}`} className='text-blue-400 underline'>
                    {genre.genre_name}
                  </Link>
                  {', '}
                </span>
              ))}</p>
            </div>
            <div className='flex flex-col w-1/2'>
              <p>Releases: {platform.map(platform => (
                <p key={platform.platform_id}>{platform.platform_name}</p>
              ))}</p>
            </div>
          </div>
          <div className='pt-20'>
            <h2 className='font-bold text-xl'>Game Description:</h2>
            <p className='pt-5'>{game.game_description}</p>
          </div>
          <div className='pt-20'>
            <h2 className='font-bold text-xl'>Storyline:</h2>
            <p className='pt-5'>{game.game_story ? game.game_story : '-'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameInfoPage