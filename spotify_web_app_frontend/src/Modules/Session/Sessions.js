import {React, useEffect, useState} from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import {useLocation} from "react-router-dom";
import pfp from '../../Assets/Images/pfp_demo.png'
import './Sessions.css'
import {
    fetchCurrentSong,
    getCurrentDeviceId,
    playCurrentSong, searchSongs,
    setCurrentDeviceId,
    setCurrentSong, setItemToQueue
} from "../SpotifyHelpers/SpotifyHelpers"
import data from "bootstrap/js/src/dom/data";
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
                        if (socket && response && isHost) {
                            console.log('HOST SEINDGIN DATA')
                            const songData = {
                                type: 'uri',
                                uri: response.item.uri
                            }
                            socket.send(JSON.stringify(songData))
                        }

                    }
                }
            }
            else if (!isHost && isOpen(socket)){
                    const uri =  songUriFromHost
                    console.log("URIL: TRUING TO SET SONG", uri)
                    await setCurrentSong(uri)
            }

        }, 3000);

        return () => {
            clearInterval(intId)
        }

    }, [socket, isHost, currentSongData])


    useEffect(() => {
        const user = localStorage.getItem('user')
        const userObj = JSON.parse(user)
        setCurrUser(userObj.user)
        // console.log(userObj.user.id)
        const socket = new WebSocket(
            `ws://127.0.0.1:8000/ws/room/${location.state.sessionId}/${userObj.user.id}`) // Replace with your WebSocket URL
        setSocket(socket)
        socket.onopen = () => {
            // const message = `${userObj.user.username} has joined the server`
            // if (currUser !== undefined) {
            //     socket.send(JSON.stringify({ type: 'message', message: message, sender: userObj.user.username}))
            // }
        }
        socket.onmessage = (event) => {
            const message = JSON.parse(event.data)
            // console.log(message)
            if ('host' in message) {
                setHost(message.host)
                if (userObj.user.username === message.host) {
                    setIsHost(true)
                    console.log('user is host')
                }
            }
            if ('uri' in message) {
                setSongUriFromHost(message.uri)
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
            console.log('WebSocket disconnected:', event.code, event.reason)
        }
        return () => {
            socket.close()
        }
    }, [])

    useEffect(() => {
        console.log("in use eff", tracksReturnedFromQuery)
    }, [tracksReturnedFromQuery])

    const sendMessage = () => {
        if (!isOpen(socket)){
            const user = localStorage.getItem('user')
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

    const addTrackToQueue = async (uri) => {
        if (isHost) {
            // add track to queue with spotify api call
            const response  = await setItemToQueue(uri)
            console.log(response)
        } else {
            // send socket message to room if the host receives it make
        }
    }


    return (
        <div className={'session-container'}>
            <div>
                Host: {host}
            </div>
            <h1 className="title">People in Session</h1>
            <h2>Session ID {location.state.sessionId}</h2>
            <div>
                <input
                    type="text"
                    placeholder="Enter search query"
                    value={searchQuery}
                    onChange={handleInputChange}
                />
                <button onClick={handleSearch}>Search</button>
            </div>
            <div className="tracks-query">
                {tracksReturnedFromQuery ? tracksReturnedFromQuery.map((t, index) => {
                    return (
                        <button key={index} className={'track'} onClick={() => setItemToQueue(t.uri)}>
                            {t.name}
                        </button>
                    );
                }) : null}
            </div>
            <PlaybackComponent
                currentSongFromHost={songUriFromHost ? songUriFromHost : null}
                isHost={isHost}
            />
            {<div className="messages">
                {messages.map((msg, index) => {
                    const isCurrentUser = msg.sender === currUser.username;
                    console.log(messages)
                    return (
                        <div key={index} className={isCurrentUser ? 'message-curr-user' : 'message'}>
                            <div className={isCurrentUser ? 'sender-text-curr-user' : 'sender-text'}>
                                {msg.sender}
                            </div>
                            <div>{msg.message}</div>
                        </div>
                    );
                })}
            </div>}
            <div className="input-area">
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    )
}

export default Sessions
