import React from 'react'
import { useState, useEffect } from 'react';
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider} from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import GameInfoPage from './pages/GameInfoPage';
import CompanyPage from './pages/CompanyPage';
import GenrePage from './pages/GenrePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';



const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await fetch('/api/auth/refreshToken', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({refreshToken})
          });
          if (response.ok) {
            const {accessToken, refreshToken, userID} = await response.json();
            localStorage.setItem('accessToken', accessToken);
            setIsLoggedIn(true);
          } else if (response.status === 401 || response.status === 403){
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userID');
            setIsLoggedIn(false);
          }
        } catch (error) {
          console.error("Failed refreshing access token", error);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('userID');
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
    }
    verifyToken();
  }, [])
  
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<MainLayout isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage setIsLoggedIn={setIsLoggedIn}/>} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="game/:id" element={<GameInfoPage />} />
        <Route path="developer/:id" element={<CompanyPage type="developers" />} />
        <Route path="publisher/:id" element={<CompanyPage type="publishers" />} />
        <Route path="genre/:id" element={<GenrePage />} />
      </Route>
    )
  );

  return <RouterProvider router = {router} />
}

export default App