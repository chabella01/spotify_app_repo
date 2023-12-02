import {React, useEffect, useState} from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import {useLocation} from "react-router-dom";
import pfp from '../../Assets/Images/pfp_demo.png'
import './Sessions.css'
import {fetchCurrentSong, playCurrentSong, setCurrentSong} from "../SpotifyHelpers/SpotifyHelpers"
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

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchCurrentSong()
            console.log("song data: ", data)
            return data
        }

        const intId = setInterval(async () => {
            const response = await fetchData()
            if (response === -1) {
                setSongPlaying(false)
            } else {
                setCurrentSongData(response)
                if (socket && currentSongData && isHost) {
                // if the user is the host then send what track they are playing to
                    // the rest of everyone every 3 seconds
                    const songData = {
                        song: response.item.track,
                        uri: response.item.uri
                    };
                    socket.send(JSON.stringify(songData))
                }
                else if (socket && currentSongData && !isHost) {
                    const uri =  currentSongData.item.uri
                    console.log(uri)
                    await setCurrentSong(uri)
                }
            }
        }, 3000);

        return () => {
            clearInterval(intId)
        }

    }, [fetchMoreData])


    useEffect(() => {
        const user = localStorage.getItem('user')
        const userObj = JSON.parse(user)
        setCurrUser(userObj.user)
        // console.log(userObj.user.id)
        const socket = new WebSocket(
            `ws://127.0.0.1:8000/ws/room/${location.state.sessionId}/${userObj.user.id}`) // Replace with your WebSocket URL
        setSocket(socket)
        socket.onopen = () => {
            const message = `${userObj.user.username} has joined the server`
            if (currUser !== undefined) {
                socket.send(JSON.stringify({ type: 'message', message: message, sender: userObj.user.username}))
            }
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
            setMessages(prevMessages => [...prevMessages, message])
        }
        socket.onclose = (event) => {
            console.log('WebSocket disconnected:', event.code, event.reason)
        }
        return () => {
            socket.close()
        }
    }, [dataFetched])

    useEffect(() => {
        // console.log(currentSongData.item.name)
    }, [currentSongData])

    const sendMessage = () => {
        if (socket && inputMessage.trim() !== '') {
            const message = {
                message: inputMessage,
                sender: currUser.username
                // Add additional properties if needed (e.g., user info, timestamps)
            };
            socket.send(JSON.stringify(message))
            setInputMessage('')
        }
    };

    const butPlayCurrentSong = async () => {
       try {
           const data = await playCurrentSong()
           // if (data === -1) {
           //     console.error(data)
           // }
           console.log('pressed')
       } catch(e) {
           console.error(e)
       }
    }
    return (
        <div className={'session-container'}>
            <div>
                Host: {host}
            </div>
            <h1 className="title">People in Session</h1>
            <h2>Session ID {location.state.sessionId}</h2>
            {
                // add is host prop to the playback component
            }
            <PlaybackComponent currentSong={currentSongData ? currentSongData.item.uri : null}/>
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
