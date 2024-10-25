import React from 'react'
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider} from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import GameInfoPage from './pages/GameInfoPage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<MainLayout />}>
      <Route index element={<HomePage />} />
      <Route path="game/:id" element={<GameInfoPage />} />
    </Route>
  )
);

const App = () => {
  return <RouterProvider router = {router} />
}

export default App