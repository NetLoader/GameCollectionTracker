import React from 'react'
import {useState} from 'react'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({setIsLoggedIn}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const nav = useNavigate();

    const Login = async (event) => {
        event.preventDefault();
        setMessage('');
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/auth/login`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email, password}),
            });
            if (response.ok) {
                const {accessToken, refreshToken, userID} = await response.json();
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
                localStorage.setItem('userID', userID);
                setIsLoggedIn(true);
                nav('/');
            } else {
                setMessage('Invalid email or password');
            }
        } catch (error) {
            console.error('Login failed', error);
        }
    }

    return (
        <div className='flex items-center justify-center min-h-screen bg-gray-900 text-white'>
            <div className='w-full max-w-sm p-5 bg-gray-800 rounded-lg'> 
                <p className='text-xl font-bold text-center'>Log in</p>
                <form onSubmit={Login}>
                    <div className='p-1'>
                        <label htmlFor="email" className='block'>Email:</label>
                        <input className='w-full p-1 bg-gray-700 border border-gray-500 rounded' id="email" name="email" type="email" value={email} onChange={(e)=> setEmail(e.target.value)} required  />

                        <label htmlFor="password" className='block mt-2'>Password:</label>
                        <input className='w-full p-1 bg-gray-700 border border-gray-500 rounded' id="password" name="password" type="password" value={password} onChange={(e)=> setPassword(e.target.value)} required  />

                        {message ? <p className="text-red-500 items-center mt-2">{message}</p> : null}

                        <button className='w-full mt-5 py-2 bg-blue-500 rounded font-bold' type='submit'>Login</button>

                        <div className='text-center mt-3'>
                            <Link to='/signup' className='text-blue-300 underline'>Sign up</Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default LoginPage