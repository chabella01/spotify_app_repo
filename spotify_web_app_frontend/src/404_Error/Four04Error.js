import {React, useState, useContext, useEffect} from 'react'
import {useNavigate} from "react-router-dom";
import './Four04Error.css'
import mj404 from "../Assets/Images/mj404.jpeg"
function Four04Error() {
    const navigate = useNavigate()
    const handleNavigate = () => {
        navigate('/login')
    }

    return (
        <div className={'wrapper'}>
            <h1 style={{color: 'white'}}>404 Error</h1>
            <p style={{color: 'white'}}>lol</p>
            <img src={mj404} alt='Not Found' />
            <button class="btn btn-outline-success" onClick={handleNavigate}>
                Return to Login Page
            </button>
        </div>
    )
}

export default Four04Error
