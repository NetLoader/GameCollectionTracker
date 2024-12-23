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
import SettingPage from './pages/SettingPage';
import { refreshTokenUtility } from '../utility/refreshToken';
import ProfilePage from './pages/ProfilePage';
import GenreListPage from './pages/GenreListPage';
import PlatformPage from './pages/PlatformPage'



const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      const localRefreshToken = localStorage.getItem('refreshToken');
      if (localRefreshToken) {
        const accessToken = await refreshTokenUtility(localRefreshToken);
        if (accessToken) {
          setIsLoggedIn(true);
        } else {
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
        <Route path="setting" element={<SettingPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="game/:id" element={<GameInfoPage isLoggedIn={isLoggedIn} />} />
        <Route path="developer/:id" element={<CompanyPage type="developers" />} />
        <Route path="publisher/:id" element={<CompanyPage type="publishers" />} />
        <Route path="platform/:id" element={<PlatformPage />} />
        <Route path="genre/:id" element={<GenrePage />} />
        <Route path="genrelist" element={<GenreListPage />} />
      </Route>
    )
  );

  return <RouterProvider router = {router} />
}

export default App