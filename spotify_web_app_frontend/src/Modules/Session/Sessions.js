import {React, useEffect, useState} from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import {useLocation, useNavigate} from "react-router-dom";
import pfp from '../../Assets/Images/pfp_demo.png'
import './Sessions.css'
import 'bootstrap/dist/css/bootstrap.css'
import { Toast } from 'bootstrap';
import {
    getRefreshToken,
    fetchCurrentSong,
    getCurrentDeviceId,
    playCurrentSong, searchSongs,
    setCurrentDeviceId,
    setCurrentSong, setItemToQueue
} from "../SpotifyHelpers/SpotifyHelpers"
import PlaybackComponent  from '../SpotifyHelpers/PlaybackComponent'
function Sessions() {
    const location = useLocation()
    const [isConnected, setIsConnected] = useState(false)
    const [messages, setMessages] = useState([])
    const [inputMessage, setInputMessage] = useState('')
    const [socket, setSocket] = useState(null)
    const [currUser, setCurrUser] = useState({})
    const [currentSongData, setCurrentSongData] = useState(null)
    const [dataFetched, setDataFetched] = useState(false)
    const [fetchMoreData, setFetchMoreData] = useState(false)
    const [songPlaying, setSongPlaying] = useState(false)
    const [host, setHost] = useState(null)
    const [isHost, setIsHost] = useState(false)
    const [songUriFromHost, setSongUriFromHost] = useState(null)
    const [searchQuery, setSearchQuery] = useState('');
    const [tracksReturnedFromQuery, setTracksReturnedFromQuery] = useState([])
    const [firstRender, setFirstRender] = useState(false)
    const [clickedAddToQueue, setClickedAddToQueue] = useState(false)
    const [allowedToQueue, setAllowedToQueue] = useState(true)
    const [killPlayer, setKillPlayer] = useState(false);

    const navigate = useNavigate()

    function isOpen(ws) { return ws.readyState === ws.OPEN }
    const handleInputChange = (event) => {
        setSearchQuery(event.target.value);
    };
    const handleSearch = async () => {
        const songs = await searchSongs(searchQuery)
        console.log(songs.items)
        setTracksReturnedFromQuery(songs.tracks.items)
    };

    useEffect(() => {
        const func = async () => {
            getRefreshToken()
        }

        const interval = setInterval(func, 30*60*1000)
        return () => clearInterval(interval)
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            // we only wanna fetch the current song for the host
            // else wait for the host to start a song
            // show paused if the host isnt playing anything
            const data = await fetchCurrentSong()
            return data
        }

        const intId = setInterval(async () => {
            if (isHost) {
                const response = await fetchData()
                if (response === -1) {
                    setSongPlaying(false)
                } else {
                    if (isOpen(socket)){
                            try {const songData = {
                                // type: 'uri',
                                sender: currUser.id,
                                uri: response.item.uri
                            }
                            socket.send(JSON.stringify(songData))
                        } catch (e) {
                            getRefreshToken()
                        }
                    }
                }
            }
            else if (!isHost && isOpen(socket)){
                    const uri =  songUriFromHost
                    const uri_arr = [uri]
                    const response_set = await setCurrentSong(uri)
            }
        }, 3000);

        return () => {
            clearInterval(intId)
        }

    }, [socket, isHost, currentSongData])


    useEffect(() => {
        const user = sessionStorage.getItem('user')
        const userObj = JSON.parse(user)
        setCurrUser(userObj.user)
        // console.log(userObj.user.id)
        let socket = null
        const createSocket = () => {
            socket = new WebSocket(
                `ws://127.0.0.1:8000/ws/room/${location.state.sessionId}/${userObj.user.id}`)
            setSocket(socket)
        }

        createSocket()

        socket.onopen = () => {

        }

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data)
            if ('host' in message) {
                setHost(message.host)
                if (userObj.user.username === message.host) {
                    setIsHost(true)
                    console.log('user is host')
                }
            }
            if ('uri' in message) {
                if (songUriFromHost !== message.uri) {
                    setSongUriFromHost(message.uri)
                }
            }
            if ('message' in message) {
                setMessages(prevMessages => [...prevMessages, message])
            }
            if ('past_messages' in message && !firstRender) {
                setMessages(prevMessages => [...prevMessages, message])
                setFirstRender(true)
            }
        }

        socket.onclose = (event) => {
            setKillPlayer(true);
            console.log('WebSocket disconnected:', event.code, event.reason);
            setTimeout(createSocket, 3000); // Reconnect after 3 seconds
        };
        return () => {
            socket.close()
        }
    }, [])

    const sendMessage = () => {
        if (!isOpen(socket)){
            const user = sessionStorage.getItem('user')
            const userObj = JSON.parse(user)
            setCurrUser(userObj.user)
            // console.log(userObj.user.id)
            const socket = new WebSocket(
                `ws://127.0.0.1:8000/ws/room/${location.state.sessionId}/${userObj.user.id}`) // Replace with your WebSocket URL
            setSocket(socket)
        }

        if (socket && inputMessage.trim() !== '') {
            const message = {
                message: inputMessage,
                sender: currUser.username
            };
            socket.send(JSON.stringify(message))
            setInputMessage('')
        }
    };

    const sendItemToHostQueue = (t) => {

        if (socket && inputMessage.trim() !== '') {
            const message = {
                queue_track: t.uri,
                sender: currUser.username
            };
            socket.send(JSON.stringify(message))
            setInputMessage('')
        }
    };

    const handleLeave = (e) => {
        e.preventDefault()
        navigate('/connections')
    }
    const addTrackToQueue = async (uri) => {
            // add track to queue with spotify api call
            const response  = await setItemToQueue(uri)
            const toastLive = document.getElementById('liveToast')
            const toast = Toast.getOrCreateInstance(toastLive)
            toast.show()
            console.log(response)
    }

    const handleAddToQueue = async (t) => {
        // const click = clickedAddToQueue
        console.log(t.uri)
        setAllowedToQueue(true)
        await setItemToQueue(t.uri);
        const toastLive = document.getElementById('liveToast')
        const toast = Toast.getOrCreateInstance(toastLive)
        toast.show()
        setTimeout(function() {
            setClickedAddToQueue(false)
        }, 2000);
    };


    return (
        <>
            <div className="header">
                <div className="session-info">
                    <h3>Session ID:</h3>
                    <p> {location.state.sessionId}</p>
                    <div>
                        <h4>Host: {host}</h4>
                    </div>
                    <button type="button" class = "btn btn-outline-success" onClick={handleLeave}>Leave Session</button>
                </div>
            </div>
        <div >
            <div className={"playback-container"}>
                <PlaybackComponent
                    currentSongFromHost={songUriFromHost ? songUriFromHost : null}
                    isHost={isHost}
                    killPlayer={killPlayer}
                />
            </div>
        <div className={'search-container'}>
                        {
                            clickedAddToQueue ? 'Song Added To Queue' : null
                        }
                        {isHost &&
                            <div>
                            <input
                                type="text"
                                placeholder="Enter search query"
                                value={searchQuery}
                                onChange={handleInputChange}
                            />
                            <button className="btn btn-outline-success" onClick={handleSearch}>Search</button>
                        </div> }
                        {isHost &&
                        <div className="tracks-query">
                            {tracksReturnedFromQuery.length !==0 ? tracksReturnedFromQuery.map((t, index) => {
                                return (
                                    <button
                                        class="me-1 mt-2 btn btn-secondary" key={index}  onClick={() => handleAddToQueue(t)}>

                                        {t.name}
                                        <br />
                                        By: {t.artists[0].name}
                                    </button>
                                );
                            }) : null}
                        </div>}
        </div>

        </div>
                {<div className="messages">
                    {messages.map((msg, index) => {
                        const isCurrentUser = msg.sender === currUser.username;
                        return (
                            <div key={index} className={isCurrentUser ? 'message-curr-user' : 'message'}>
                                <div className={isCurrentUser ? 'sender-text-curr-user' : 'sender-text'}>
                                    {msg.sender}
                                </div>
                                <div>{msg.message}</div>
                            </div>
                        );
                    })}
                    <div className="input-area">
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                        />
                        <button onClick={sendMessage}>Send</button>
                    </div>
                </div>}
            <div class="toast-container position-fixed bottom-0 end-0 p-3">
                <div id="liveToast" class="toast text-bg-success" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="toast-header">
                    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                    <div class="toast-body">
                    Song Added to the Queue!
                    </div>
                </div>
                </div>
    </>

    )
}

export default Sessions
