import {React, useState, useContext, useEffect} from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import './Login.css'
import {useNavigate} from "react-router-dom";
import logo from "../../Assets/Images/spotify connections-logos_transparent.png";
import axios from "axios";
import {useAuth} from "../Routing/AuthProvider";
import Alert from 'react-bootstrap/Alert';
import 'bootstrap/dist/css/bootstrap.min.css';
function Login() {

    const base_url = 'http://127.0.0.1:8000/'

    const navigate = useNavigate();

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const auth = useAuth()

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    function handleClick() {
        navigate('/register')
    }

    const handleChangeUsername = (e) => {
        e.preventDefault()
        setUsername(e.target.value)
    }

    const handleChangePassword = (e) => {
        e.preventDefault()
        setPassword(e.target.value)
    }

    const handleLogin = async () => {
        try {
            const response = await axios.post(base_url + '/login', {username: username, password: password})
            await auth.login(response.data)
        } catch (e) {
            console.log(e)
            showAlertMessage('Incorrect email or password. Please try again.');
        }
    }

    const showAlertMessage = (message) => {
        setAlertMessage(message);
        setShowAlert(true);
    };    

    return (
        <div className={'login-wrapper'}>
            <Form className={"form-wrapper"}>
                <div className={'header-login text-success'}>
                    {showAlert && <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
                    {alertMessage}
                    </Alert>}
                    Let's Start Listening
                </div>
                <Form.Group className={"login-group"}>
                    <Form.Label className={"form-text"}>Username</Form.Label>
                    <Form.Control
                        type={'text'}
                        value={username}
                        onChange={handleChangeUsername}
                    />
                </Form.Group>
                <Form.Group className={"login-group"}>
                    <Form.Label className={"form-text"}>Password</Form.Label>
                    <Form.Control
                        type={'password'}
                        //value={password}
                        onChange={handleChangePassword}
                    />
                </Form.Group>
                <div className={"button-wrapper"}>
                    <Button variant={"success"} className={"form-button"} onClick={handleLogin}>
                        Login
                    </Button>
                </div>
                <div className={'register-wrapper'}>
                    <div className={"form-text sub-font-color"}> Don't have an account?</div>
                    <div onClick={handleClick} className={"form-text change-cursor text-success"}>
                        Click here to register
                    </div>
                </div>
            </Form>
        </div>
    )
}

export default Login
