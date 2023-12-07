import {React, useState} from 'react'
import './Connections.css'
import {useNavigate} from "react-router-dom";
import pfp_demo from '../../Assets/Images/pfp_demo.png'

function Connections() {

    const [sessionId, setSessionId] = useState(0)
    const [inputError, setInputError] = useState(false)
    const navigate = useNavigate()


    const handleCreateString = () => {
        const length = 8;
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }

        return result;
    }

    const handleClickJoinSession = (e) => {
        e.preventDefault();
        if (sessionId.length === 8) {
            navigate('/sessions', { state: { sessionId: sessionId } });
            setInputError(false)
        } else {
            // Render an error or notify the user about the generated session ID
            setInputError(true)
        }
    };

    const handleClickCreateSession = (e) => {
        e.preventDefault()
        const sessionId = handleCreateString()
        navigate('/sessions', {state: {sessionId: sessionId}})
    }

    const handleChangeSessionId = (e) => {
        const inputValue = e.target.value;
        setSessionId(inputValue);

    };

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
            return <div>no profile</div>
        }
    }

    const InputError = () => {
        if (inputError) {
            return (
                <div className={'input-error'}>
                    Please Enter a Valid 8 Character Session ID
                </div>
            )
        }
    }

    return (
        <div className="connections-container bg-dark" id="container">
            {getProfileData()}
                <title>Spotify Page to create session button</title>
                <link rel="stylesheet" href="connection_page_styles.css"/>
            <InputError />
            <div className={'form-container'}>
                <form className="form-floating">
                    <div className="mb-3">
                        <label htmlFor="numericInput" className="form-label">Enter Session ID:</label>
                        <div style={{display: 'grid', justifyContent: 'center'}}>
                        <input
                            id="numericInput"
                            name="numericInput"
                            className="form-control"
                            maxLength="8"
                            onChange={handleChangeSessionId}
                        />
                        </div>
                        
                    </div>
                    <div className="mb-3">
                        <button className="btn btn-success me-2" onClick={handleClickJoinSession}>
                            Join Existing Session
                        </button>
                        <button className="btn btn-secondary" onClick={handleClickCreateSession}>
                            Or Create A New Session
                        </button>
                    </div>
                    <p className="text-muted">
                        Attempting to join a session that does not exist will create a new session.
                    </p>
                </form>
            </div>

        </div>

    )
}

export default Connections