import React from 'react'

const Card = ({children}) => {
  return (
    <div className='relative overflow-hidden rounded-xl border border-gray-700 bg-gray-800 text-white w-36 min-w-36 sm:w-60 sm:min-w-60 min-h-48 max-h-48 sm:min-h-80 sm:max-h-80 '>
        {children}
    </div>
  )
}

export default Card