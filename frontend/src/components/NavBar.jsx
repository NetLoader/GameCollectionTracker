import React from 'react'
import {useState} from 'react'
import {Link} from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import SearchBar from './SearchBar'

const NavBar = ({isLoggedIn, setIsLoggedIn}) => {
    const [dropDown, setDropDown] = useState(false);
    const nav = useNavigate();

    const toggleDropDown = () => {
        setDropDown(!dropDown)
    }

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userID');
        setIsLoggedIn(false);
        nav('/login');
        setDropDown(false);
    }

    return (
        <nav className='bg-gray-900 border-b border-gray-700 h-15 flex justify-between items-center p-4'>
            <div className='font-bold'>
                <Link to='/'>Game Collection Tracker</Link>
            </div>
            <div className='flex items-center space-x-1 md:space-x-5'>
                <SearchBar/>
                <Link className='hidden sm:block hover:bg-gray-700 px-3 py-2 rounded' to="/genrelist">Genres</Link>
                {isLoggedIn ? (
                    <div>
                        <button onClick={toggleDropDown} className='hover:bg-gray-700 px-3 py-2 rounded'>
                            Menu
                        </button>
                        {dropDown ? (
                            <div className="absolute right-3 mt-1 w-28 bg-gray-900 text-white border-2 border-gray-600 rounded shadow-lg z-50">
                                <Link to="/genrelist" onClick={toggleDropDown}  className='sm:hidden block px-4 py-2 hover:bg-gray-700 rounded'>Genres</Link>
                                <Link to="/profile" onClick={toggleDropDown} className="block px-4 py-2 hover:bg-gray-700 rounded">Profile</Link>
                                <Link to="/setting" onClick={toggleDropDown} className="block px-4 py-2 hover:bg-gray-700 rounded">Settings</Link>
                                <button onClick={logout} className="block px-4 py-2 font-bold text-red-600 hover:bg-gray-700 rounded w-full text-left">Logout</button>
                            </div>
                        ) : null}
                    </div>
                ) : (
                    <Link to="/login" className="block px-4 py-2 hover:bg-gray-700 rounded">Login</Link>
                )}
            </div>
        </nav>
    )
}

export default NavBar