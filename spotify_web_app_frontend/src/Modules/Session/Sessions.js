import {React} from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import {useLocation} from "react-router-dom";
import pfp from '../../Assets/Images/pfp_demo.png'
import './Sessions.css'
function Sessions() {
    const location = useLocation()
    console.log(location.state)
    return (
        <div className={'session-container'}>
            <h1 className="title">People in Session</h1>
            <h2>Session ID {location.state.sessionId}</h2>
            <p className="person">
                <img className="Spotify_PFP" src={pfp} alt="Person 1" />
                Person 1
            </p>
            <p className="person">
                <img className="Spotify_PFP" src={pfp} alt="Person 2" />
                Person 2
            </p>
            <p className="person">
                <img className="Spotify_PFP" src={pfp}  alt="Person 3" />
                Person 3
            </p>
            <p className="person">
                <img className="Spotify_PFP" src={pfp}  alt="Person 4" />
                Person 4
            </p>
            <p>Waiting...</p>
        </div>
    )
}

export default Sessions
