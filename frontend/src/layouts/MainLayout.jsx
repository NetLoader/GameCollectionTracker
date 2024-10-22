import React from 'react'
import {Outlet} from 'react-router-dom';
import NavBar from '../components/NavBar';

const MainLayout = () => {
  return (
    <div className='bg-gray-950 text-white min-h-screen'>
        <NavBar isLoggedIn={true}/>
        <Outlet />
    </div>
  )
}

export default MainLayout