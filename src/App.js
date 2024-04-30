import React from 'react';
import './App.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"
import Layout from './components/Layout/layout';
import Error from './pages/error/error';
import routes from './routes';
//import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


function App() {
  const router = createBrowserRouter([
    {
      element: <Layout/>,
      errorElement: <Error/>,
      children: routes
    }
  ])

  return (
      <RouterProvider router={router} />
  )
}

export default App;
