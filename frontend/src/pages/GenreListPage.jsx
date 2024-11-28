import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

const GenreListPage = () => {
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllGenres = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/genres?limit=200&offset=0`);
                const data = await response.json();
                setGenres(data); 
            } catch (error) {
                console.error('Error fetching API:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchAllGenres();
    },[])

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className='container m-auto py-20 px-5'>
            <div className='flex flex-col'>
                <h1 className='font-bold text-4xl'>List Of All Genres</h1>
                <div className='flex flex-col justify-left gap-2 px-5 mt-5 sm:px-10'>
                    {genres.map((genre) => (
                        <div key={genre.genre_id}>
                            <Link to={`/genre/${genre.genre_id}`} className='font-bold text-xl text-cyan-500 hover:text-emerald-500'>{genre.genre_name}</Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default GenreListPage