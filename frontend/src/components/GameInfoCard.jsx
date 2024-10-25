import React from 'react'
import Card from './Card'

const GameInfoCard = ({imageURL, gameName}) => {
  return (
    <Card>
        <img className='w-full' src={imageURL} alt={gameName} />
    </Card>
  )
}

export default GameInfoCard