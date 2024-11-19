import React from 'react'
import {useState} from 'react'
import {Link} from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

const NavBar = ({isLoggedIn, setIsLoggedIn}) => {
    const [dropDownOn, setDropDownOn] = useState(false);
    const nav = useNavigate();

    const toggleDropDown = () => {
        setDropDownOn(!dropDownOn)
    }

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userID');
        setIsLoggedIn(false);
        nav('/login');
    }

    return (
        <nav className='bg-gray-900 border-b border-gray-700 h-15 flex justify-between items-center p-4'>
            <div className='font-bold'>
                <Link to='/'>Game Collection Tracker</Link>
            </div>
            <div className='flex items-center space-x-1 md:space-x-5'>
                <input type="text" className='px-4 py-2 text-white bg-gray-800 border-2 border-gray-600 rounded w-24 md:w-64' placeholder='Search' />
                {isLoggedIn ? (
                    <div>
                        <button onClick={toggleDropDown} className='hover:bg-gray-700 px-3 py-2 rounded'>
                            Menu
                        </button>
                        {dropDownOn && (
                            <div className="absolute right-3 mt-1 w-28 bg-gray-900 text-white border-2 border-gray-600 rounded shadow-lg z-50">
                                <Link to="/profile" className="block px-4 py-2 hover:bg-gray-700 rounded">Profile</Link>
                                <Link to="/setting" className="block px-4 py-2 hover:bg-gray-700 rounded">Settings</Link>
                                <button onClick={logout} className="block px-4 py-2 font-bold text-red-600 hover:bg-gray-700 rounded w-full text-left">Logout</button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link to="/login" className="block px-4 py-2 hover:bg-gray-700 rounded">Login</Link>
                )}
            </div>
        </nav>
    )
}

export default NavBar