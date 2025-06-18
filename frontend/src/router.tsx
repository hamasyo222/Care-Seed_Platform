import { createBrowserRouter } from 'react-router-dom';
import React from 'react';
import { Home } from './pages/Home';

export const router = createBrowserRouter([
  {
    path: '/',
    element: React.createElement(Home),
  },
]);
