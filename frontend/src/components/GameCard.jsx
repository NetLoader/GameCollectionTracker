import React from 'react'


const Card = ({imageURL, gameName}) => {
  return (
    <div className='relative overflow-hidden rounded-xl border border-gray-700 bg-gray-800 text-white w-36 sm:w-60 min-h-48 max-h-48 sm:min-h-80 sm:max-h-80'>
      <img className='w-full' src={imageURL} alt={gameName} />
      <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 opacity-0 hover:opacity-100">
        <p className="text-center text-white font-bold sm:text-2xl">{gameName}</p>
      </div>
    </div>
  )
}

export default Card