import {React, useState} from 'react'
import './Connections.css'
import 'bootstrap/dist/css/bootstrap.css';
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
        const {display_name, images} = JSON.parse(profile)
        console.log(images)
        if(profile) {
            return (
                <div>
                    <h2>
                        Welcome {display_name}
                        
                    </h2>
                    <div class='text-center'>
                        <img class="rounded mx-auto d-block" src={images[0].url} alt=''/>
                    </div>
                </div>
                
            )

        }
    }

    return (
        <div className="connections-container" id="container">
                <title>Spotify Page to create session button</title>
                <link rel="stylesheet" href="connection_page_styles.css"/>
                    {getProfileData()}
            <form class='form-floating'>
                <label htmlFor="numericInput">Enter 4-digit Session ID:</label>
                <input
                class="form-control"
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
            </form>
        </div>

    )
}

export default Connections
