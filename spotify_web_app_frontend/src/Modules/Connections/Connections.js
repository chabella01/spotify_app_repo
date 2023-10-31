import {React, useState} from 'react'
import './Connections.css'
import {useNavigate} from "react-router-dom";

function Connections() {

    const [sessionId, setSessionId] = useState(0)

    const navigate = useNavigate()

    const handleChangeInput = (e) => {
        setSessionId(e)
    }

    const handleClickJoinSession = (e) => {
        e.preventDefault()
        navigate('/sessions', {state: {sessionId: sessionId}})
    }

    const handleClickCreateSession = (e) => {
        e.preventDefault()
        navigate('/sessions', {state: {sessionId: sessionId}})
    }

    const handleChangeSessionId = (e) => {
        setSessionId(e.target.value)
    }

    const getProfileData = () => {
        const profile = localStorage.getItem('profile')

        const {display_name} = JSON.parse(profile)

        if(profile) {
            return (
                <div>
                    Welcome {display_name}
                </div>
            )

        }
    }

    return (
        <div className="connections-container" id="container">
            {getProfileData()}
                <title>Spotify Page to create session button</title>
                <link rel="stylesheet" href="connection_page_styles.css"/>
            <div className={'form-container'}>
                <label htmlFor="numericInput">Enter 4-digit Session ID:</label>
                <input
                    type="number"
                    id="numericInput"
                    name="numericInput"
                    min="0"
                    max="9999"
                    maxLength="4"
                    onChange={handleChangeSessionId}
                />
                <button className={'session-button'}
                    onClick={handleClickCreateSession}
                >
                    Join Existing Session</button>
                <button className={"session-button"}>Or Create A New Session</button>
            </div>
        </div>

    )
}

export default Connections
