import {React, useState, useContext, useEffect} from 'react'
import {useNavigate} from "react-router-dom";
import './Four04Error.css'
function Four04Error() {
    const navigate = useNavigate()
    const handleNavigate = () => {
        navigate('/login')
    }

    return (
        <div className={'wrapper'}>
            <h1>404 Error</h1>

            <button onClick={handleNavigate}>
                Login
            </button>
        </div>
    )
}

export default Four04Error
