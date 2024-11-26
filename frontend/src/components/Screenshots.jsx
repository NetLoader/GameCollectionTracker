import React, { useEffect, useState } from 'react'

const Screenshots = ({gameID}) => {
    const [gameplayImage, setGameplayImage] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchScreenshots = async () => {
            try {
                const res = await fetch(`/api/games/${gameID}/screenshots`);
                const data = await res.json();
                setGameplayImage(data);
            } catch (error) {
                console.error('Error fetching API:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchScreenshots();
    }, [gameID])

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className='flex items-center gap-2 py-4 overflow-auto'>
            {gameplayImage.map((image) => (
                <img key={image.game_screenshots_url} src={image.game_screenshots_url} alt="screenshots" className='border border-gray-500 w-full'/>
            ))}
        </div>
    )
}

export default Screenshots

