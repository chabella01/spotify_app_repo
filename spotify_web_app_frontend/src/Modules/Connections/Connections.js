import {React, useState} from 'react'
import './Connections.css'
import {useNavigate} from "react-router-dom";
import pfp_demo from '../../Assets/Images/pfp_demo.png'

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
        let value = e.target.value;
        // Remove non-numeric characters
        value = value.replace(/\D/g, '');
    
        // Limit input to 4 digits
        if (value.length > 4) {
          value = value.slice(0, 4);
        }
    
        setSessionId(value);
    }

    const getProfileData = () => {
        const profile = sessionStorage.getItem('profile')

        const {display_name, images} = JSON.parse(profile)

        if(profile) {
            return (
                <div class="card text-bg-dark">
                    <img className={"rcard-img-top"} src={images.length === 0 ? pfp_demo : images[0].url}/>
                    <h2 className={"card-title"}>
                        Welcome {display_name}

                    </h2>

                </div>
            )

        } else {
            return <div>no profule</div>
        }
    }

    return (
        <div className="connections-container" id="container">
            {getProfileData()}
                <title>Spotify Page to create session button</title>
                <link rel="stylesheet" href="connection_page_styles.css"/>
            <form class="form-floating">
                <label htmlFor="numericInput">Enter 4-digit Session ID:</label>
                <input
                    type="text" 
                    id="numericInput"
                    name="numericInput"
                    className="form-control"
                    value={sessionId}
                    onChange={handleChangeSessionId}
                    />
                <button className={'session-button'}
                    onClick={handleClickJoinSession}
                >
                    Join Existing Session</button>
                <button className={"session-button"}
                    onClick={handleClickCreateSession}>Or Create A New Session</button>
            </form>
        </div>

    )
}

export default Connections