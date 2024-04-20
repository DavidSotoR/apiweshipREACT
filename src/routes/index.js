import React from "react"
import PathConstants from "./pathConstants"
import { Navigate } from "react-router-dom";

const Home = React.lazy(() => import("../pages/home/home"))
const Login = React.lazy(() => import("../pages/login/login"))
const Details = React.lazy(() => import("../pages/details/details"))

const isAuthenticated = () => {
    if (localStorage.getItem('login') == 'true') {
      console.log('estas logeado redireige');
      return true
    }
    return false; 
  };
  
  const PrivateRoute = ({ element }) => {
    return isAuthenticated() ? element : <Navigate to={PathConstants.LOGIN} replace />;
  };

const routes = [
    { path: PathConstants.HOME, element: <PrivateRoute element={<Home />}/>},
    { path: PathConstants.DETAILS, element: <PrivateRoute element={<Details />}/>},
    { path: PathConstants.LOGIN, element: <Login /> },
]

export default routes