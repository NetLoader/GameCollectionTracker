import React from 'react'
import {useState} from 'react'
import {Link} from 'react-router-dom'

const NavBar = ({isLoggedIn}) => {
    const [dropDownOn, setDropDownOn] = useState(false);
    const toggleDropDown = () => {
        setDropDownOn(!dropDownOn)
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
                            <div className="absolute right-3 mt-1 w-28 bg-gray-900 text-white border-2 border-gray-600 rounded shadow-lg">
                                <Link to="/profile" className="block px-4 py-2 hover:bg-gray-700 rounded">Profile</Link>
                                <Link to="/settings" className="block px-4 py-2 hover:bg-gray-700 rounded">Settings</Link>
                                <Link to="/logout" className="block px-4 py-2 font-bold text-red-600 hover:bg-gray-700 rounded">Logout</Link>
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