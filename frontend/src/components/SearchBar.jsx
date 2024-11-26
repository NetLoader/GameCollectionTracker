import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';

const SearchBar = () => {
    const [dropDown, setDropDown] = useState(false);
    const [dropDownSearch, setDropDownSearch] = useState(false);
    const [searchResult, setSearchResult] = useState([]);
    const [searchType, setSearchType] = useState('game');
    const [searchText, setSearchText] = useState('')
    const nav = useNavigate();

    const toggleDropDown = () => {
        setDropDown(!dropDown)
    }

    const toggleDropDownSearch = () => {
        setDropDownSearch(!dropDownSearch)
    }

    const searching = async (input) => {
        setSearchText(input);
        if (searchText === '') {
            setSearchResult([]);
            return;
        }
        try {
            const response = await fetch(`/api/search?type=${searchType}&name=${searchText}`);
            const data = await response.json();
            if (response.ok) {
                setSearchResult(data);
            } else {
                console.error('Error searching');
            }
        } catch (error) {r
            console.error('Searching failed', error);
        }
    }

    const click = (ID) => {
        if (searchType === 'game') {
            nav(`/game/${ID}`);
        } else if (searchType === 'genre') {
            nav(`/genre/${ID}`);
        } else if (searchType === 'platform') {
            nav(`/platform/${ID}`);
        }
        setDropDownSearch(false);
        setSearchText('')
    }


    return (
        <div className='flex'>
            <div className='relative px-1 py-2 text-white bg-gray-800 border-t-2 border-l-2 border-b-2 w-20 border-gray-600 rounded-l text-center'>
                <button onClick={toggleDropDown}>{searchType}</button>
                {dropDown ? (
                    <div className='absolute mt-3 py-2 w-20 bg-gray-900 text-white border-2 border-gray-600 rounded shadow-lg z-50 right-0 text-center'>
                        <button className='py-1 hover:bg-gray-700 w-full' onClick={() => {toggleDropDown(); setSearchType('game')}}>Games</button>
                        <button className='py-1 hover:bg-gray-700 w-full' onClick={() => {toggleDropDown(); setSearchType('genre')}}>Genres</button>
                        <button className='py-1 hover:bg-gray-700 w-full' onClick={() => {toggleDropDown(); setSearchType('platform')}}>Platform</button>
                    </div>
                ) : null}
            </div>
            <div className='flex flex-col'>
                <input type="text" onClick={toggleDropDownSearch} className='px-4 py-2 text-white bg-gray-800 border-2 border-gray-600 rounded-r w-24 md:w-64' placeholder='Search' value={searchText} onChange={(e) => {searching(e.target.value)}}/>
                {dropDownSearch && searchResult.length > 0 ? (
                    <div className='absolute mt-3 py-2 w-24 md:w-64 bg-gray-900 text-white border-2 border-gray-600 rounded shadow-lg z-50 translate-y-8 text-center'>
                        {searchResult.map((result, index) => (
                            <div key={searchType === 'game' ? `${searchType}${index}` : searchType === 'genre' ? `${searchType}${index}` : `${searchType}${index}`}>
                                {searchType === 'game' ? (<button onClick={() => click(result.game_id)} className='bg-gray-800 hover:bg-gray-700 w-full py-1 my-1'>{result.game_title}</button>)
                                :searchType === 'genre' ? (<button onClick={() => click(result.genre_id)} className='bg-gray-800 hover:bg-gray-700 w-full py-1 my-1'>{result.genre_name}</button>)
                                : <button onClick={() => click(result.platform_id)} className='bg-gray-800 hover:bg-gray-700 w-full py-1 my-1'>{result.platform_name}</button>}
                            </div>
                        ))}
                    </div>
                ) : null}
            </div>
        </div>
    )
}

export default SearchBar