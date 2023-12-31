import logo from './logo.svg';
import './App.css';
import {Navigate, Route, Routes, useNavigate, useRoutes} from "react-router-dom";
import {useEffect, useState} from "react";
import RenderRoutes from '../src/Modules/RenderRoutes/RenderRoutes'
import {ProtectedRoute} from "./Modules/Routing/ProtectedRoute";
import Connections from "./Modules/Connections/Connections";
import Login from "./Modules/Login/Login";
import Register from "./Modules/Register/Register";
import Layout from "./Modules/Layout/Layout";
import AboutUs from './Modules/AboutUs/AboutUs';
import CreateSession from "./Modules/CreateSession/CreateSession";
import {useAuth} from "./Modules/Routing/AuthProvider";
import {completeLogin, getAccessToken} from '../src/Modules/SpotifyHelpers/SpotifyHelpers'
import Callback from '../src/Modules/Callback/Callback'
import Sessions from "./Modules/Session/Sessions";
import Four04Error from "./404_Error/Four04Error";
function App() {



  return (
    <Routes>
        <Route element={<Layout />}>
            <Route path = '/login' element={<Login />}/>
            <Route path = '/register' element={<Register/>}/>
            <Route path = '/' element={<Navigate to={'/login'}/>}/>
            <Route path = '/callback' element={<Callback />}/>
            <Route path = '*' element={<Four04Error />}/>
            <Route
                path={'/connections'}
                element={
                    <ProtectedRoute>
                        <Connections />
                    </ProtectedRoute>
                }
            />
            <Route
                path={'/create_session'}
                element={
                    <ProtectedRoute>
                        <CreateSession />
                    </ProtectedRoute>
                }
            />
            <Route
                path={'/sessions'}
                element={
                    <ProtectedRoute>
                        <Sessions />
                    </ProtectedRoute>
                }
            />
            <Route
                path={'/about'}
                element={
                    <AboutUs />
                }
            />
        </Route>
    </Routes>
  );
}

export default App;
