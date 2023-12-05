import {Navigate, Outlet} from "react-router-dom";
import Login from '../Login/Login'
import Connections from '../Connections/Connections'
import Sessions from '../Session/Sessions'
import Register from "../Register/Register";
import AboutUs from "../AboutUs/AboutUs";
const RenderRoutes = (isLoggedIn) => [
    {
        path: '/',
        element: <Connections />,
        children: [
            { path: '/session', element : <Sessions /> },
            { path: '/', element: <Navigate to={'/connections'}/> }
        ]
    },
    {
        path: '/login',
        element: !isLoggedIn ? <Login /> : <Navigate to={'/'} />
    },
    {
        path: '/register',
        element: !isLoggedIn ? <Register /> : <Navigate to={'/'} />
    },
    {
        path: '/about',
        element: <AboutUs />
    },

]

export default RenderRoutes