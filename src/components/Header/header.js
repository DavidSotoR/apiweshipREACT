import { Link } from "react-router-dom"
//import "../styles/Header.css"
import PathConstants from "../../routes/pathConstants"
import { useEffect, useState } from "react";

const NavLinkItem = ({ to, children }) => (
    <li className="nav-item">
      <Link to={to} className="nav-link text-white" aria-label="Close">{children}</Link>
    </li>
  );

export default function Header() {
    const [isLoggedValue, setIsLoggedValue] = useState(false)
    useEffect(() => {
        const isLogged = () => {
            const login = localStorage.getItem('login');
            console.log(login == 'true');
            return login == 'true';
          };
      
          setIsLoggedValue(isLogged());
      }, []);

    var logout = ()=>{
        localStorage.clear()
        window.location.replace('login')
    }
    return (
        <nav className="navbar navbar-expand-sm bg-primary border-bottom border-body sticky-top">
            <div className="container-fluid">
                <a className="navbar-brand text-white">PRUEBA</a>
                { isLoggedValue && 
                <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDarkNavbar" aria-controls="offcanvasDarkNavbar" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon text-white"></span>
                </button>}
            

                <div class="offcanvas offcanvas-end text-bg-primary" tabindex="-1" id="offcanvasDarkNavbar" aria-labelledby="offcanvasDarkNavbarLabel">
                    <div class="offcanvas-header">
                        <h5 class="offcanvas-title" id="offcanvasDarkNavbarLabel">Menu</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div class="offcanvas-body">
                        <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
                        { isLoggedValue && <NavLinkItem to={PathConstants.HOME} children={'HOME'}></NavLinkItem>}
                        { isLoggedValue && <li className="nav-item">
                                <a className="nav-link text-white" aria-current="page" onClick={logout} data-bs-dismiss="offcanvas" aria-label="Close">LOGOUT</a>
                            </li>}
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    )
}