import React from 'react'
import {useState} from 'react'
import { Link } from 'react-router-dom';

const SignupPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const Signup = async (event) => {
        event.preventDefault();
        setMessage('');
        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({username, email, password}),
            });
            if (response.ok) {
                setMessage('Signup successful!');
            } else {
                setMessage('Account with the same email already exist');
            }
        } catch (error) {
            console.error('Sign up failed', error);
        }
    }

    return (
        <div className='flex items-center justify-center min-h-screen bg-gray-900 text-white'>
            <div className='w-full max-w-sm p-5 bg-gray-800 rounded-lg'> 
                <p className='text-xl font-bold text-center'>Sign Up</p>
                <form onSubmit={Signup}>
                    <div className='p-1'>
                        <label htmlFor="username" className='block'>Username:</label>
                        <input className='w-full p-1 bg-gray-700 border border-gray-500 rounded' id="username" name="username" type="username" value={username} onChange={(e)=> setUsername(e.target.value)} required  />

                        <label htmlFor="email" className='block mt-2'>Email:</label>
                        <input className='w-full p-1 bg-gray-700 border border-gray-500 rounded' id="email" name="email" type="email" value={email} onChange={(e)=> setEmail(e.target.value)} required  />

                        <label htmlFor="password" className='block mt-2'>Password:</label>
                        <input className='w-full p-1 bg-gray-700 border border-gray-500 rounded' id="password" name="password" type="password" value={password} onChange={(e)=> setPassword(e.target.value)} required  />

                        {message === 'Signup successful!' ? <p className="text-blue-500 items-center mt-2">{message}</p> : <p className="text-red-500 items-center mt-2">{message}</p>}

                        <button className='w-full mt-5 py-2 bg-blue-500 rounded font-bold' type='submit'>Sign Up</button>

                        <div className='text-center mt-3'>
                            <Link to='/login' className='text-blue-300 underline'>Login</Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SignupPage