import React from 'react'
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider} from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import GameInfoPage from './pages/GameInfoPage';
import CompanyPage from './pages/CompanyPage';
import GenrePage from './pages/GenrePage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<MainLayout />}>
      <Route index element={<HomePage />} />
      <Route path="game/:id" element={<GameInfoPage />} />
      <Route path="developer/:id" element={<CompanyPage type="developers" />} />
      <Route path="publisher/:id" element={<CompanyPage type="publishers" />} />
      <Route path="genre/:id" element={<GenrePage />} />
    </Route>
  )
);

const App = () => {
  return <RouterProvider router = {router} />
}

export default App