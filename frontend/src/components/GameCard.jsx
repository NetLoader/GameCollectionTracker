import React from 'react'
import Card from './Card'
import {useNavigate} from 'react-router-dom'

const GameCard = ({imageURL, gameName, gameID}) => {
  const nav = useNavigate();
  const click = () => {
    nav(`/game/${gameID}`);
  }

  return (
    <div onClick={click} className="cursor-pointer">
      <Card>
        <img className='w-full' src={imageURL} alt={gameName} />
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 opacity-0 hover:opacity-100">
          <p className="text-center text-white font-bold sm:text-2xl">{gameName}</p>
        </div>
      </Card>
    </div>
  )
}

export default GameCard