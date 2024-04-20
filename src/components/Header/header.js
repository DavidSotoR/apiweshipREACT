import { Link } from "react-router-dom"
//import "../styles/Header.css"
import PathConstants from "../../routes/pathConstants"
import { useEffect, useState } from "react";

const NavLinkItem = ({ to, children }) => (
    <li className="nav-item">
      <Link to={to} className="nav-link">{children}</Link>
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
                <nav className="navbar navbar-expand-lg bg-body-tertiary">
                    <div className="container-fluid">
                        <a className="navbar-brand">PRUEBA</a>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                
                                { isLoggedValue && <li className="nav-item">
                                        <a className="nav-link" aria-current="page" onClick={logout}>Logout</a>
                                    </li>}
                                { !isLoggedValue && <NavLinkItem to={PathConstants.LOGIN} children={'LOGIN'}></NavLinkItem>}
                                { isLoggedValue && <NavLinkItem to={PathConstants.HOME} children={'HOME'}></NavLinkItem>}
                            </ul>

                        </div>
                    </div>
                </nav>
    )
}