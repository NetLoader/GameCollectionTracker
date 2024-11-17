import React from 'react'
import {Outlet} from 'react-router-dom';
import NavBar from '../components/NavBar';

const MainLayout = ({isLoggedIn, setIsLoggedIn}) => {
  return (
    <div className='bg-gray-950 text-white min-h-screen'>
        <NavBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
        <Outlet />
    </div>
  )
}

export default MainLayout