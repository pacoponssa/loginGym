import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fortawesome/fontawesome-free/css/all.min.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";


import axios from 'axios';


import Login from './components/Login';

import './index.css';


axios.defaults.baseURL = 'http://localhost:3000';
const router = createBrowserRouter([
  {
    path : "/",
    element: <Login />, 
    },
]);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
