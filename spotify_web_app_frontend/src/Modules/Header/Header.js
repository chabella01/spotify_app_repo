import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav'
import {matchRoutes, useLocation, useNavigate} from "react-router-dom";
import './Header.css'
import logo from "../../Assets/Images/spotify connections-logos_white.png"
import {React} from "react";
import Button from "react-bootstrap/Button";
import {useAuth} from "../Routing/AuthProvider";
import 'bootstrap/dist/css/bootstrap.css';

function Header() {
    const navigate = useNavigate()
    const handleClickNewSession = (e) => {
        e.preventDefault()
        navigate('/connections')
    }
    const handleClickAboutUs = (e) => {
        e.preventDefault()
        navigate('/about')
    }
    const routes = [
        {path: '/connections'},
        {path: '/sessions'},
        {path: '/login'},
        {path: '/register'},
        {path: '/create_session'},
        {path: '/'},
        {path: '/callback'},
        {path: '/about'}

    ]
    const auth = useAuth()

    const location = useLocation()
    const [{route}] = matchRoutes(routes, location)
    const renderNavBar = () => {
        if (!(route.path === '/login') && !(route.path === '/register')) {
            return (
                <>
                <a class="nav-link" onClick={handleClickNewSession}>New Session</a>
                <a class="nav-link" onClick={handleClickAboutUs}>About Us</a>
                <a class="nav-link" onClick={auth.logout}>Logout</a>
                
                </>
            )
        }
        else {
            return (
                <a class="nav-link" onClick={handleClickAboutUs}>About Us</a>
            )
        }
    }


    return (
        <nav class="navbar bg-body-tertiary nav-pills bg-dark" data-bs-theme="dark">
            <img src={logo} alt="Logo" className={"header-logo"}/>
            <div class='nav-item'>
                {renderNavBar()}
            </div>
        </nav>
    )
}

export default Header