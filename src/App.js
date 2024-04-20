import React from 'react';
import logo from './logo.svg';
import './App.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"
import Home from "./pages/home/home"
import Login from "./pages/login/login"
import Layout from './components/Layout/layout';
import Error from './pages/error/error';
import routes from './routes';
import 'bootstrap/dist/css/bootstrap.css';



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

  /* return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  ); */
}

export default App;
