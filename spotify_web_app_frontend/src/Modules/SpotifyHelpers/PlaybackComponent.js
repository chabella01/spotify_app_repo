import React, { useState, useEffect } from 'react';
import './PlaybackComponent.css'
import SpotifyPlayer from 'react-spotify-player';
import {fetchCurrentSong, getCurrentDeviceId, setCurrentDeviceId, setCurrentSong} from "./SpotifyHelpers";
import Paused from '../../Assets/pasued.png'
import 'bootstrap/dist/css/bootstrap.css';

const track = {
    name: "",
    album: {
        images: [
            { url: "" }
        ]
    },
    artists: [
        { name: "" }
    ]
}

function PlaybackComponent(props) {
    const [player, setPlayer] = useState(undefined);
    const [is_paused, setPaused] = useState(false);
    const [is_active, setActive] = useState(false);
    const [current_track, setTrack] = useState(track)
    const [isCurrDevice, setIsCurrDevice] = useState(false)
    useEffect(() => {
        const setCurrentSongNotHost = async () => {
            const response = await setCurrentSong(props.currentSongFromHost)
            return response
        }

        console.log('after set id: ', props.isHost, props.currentSongFromHost)
        if (!props.isHost && props.currentSongFromHost) {
            //
            const response = setCurrentSongNotHost()
            console.log(response )
        }
    }, [props.currentSongFromHost])


    useEffect(() => {

        const setDeviceId = async () => {
            const deviceId = await getCurrentDeviceId()
            return deviceId
        }



        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);
        const accessToken = localStorage.getItem('access_token')

        if (!player) {
            window.onSpotifyWebPlaybackSDKReady = () => {
                const player = new window.Spotify.Player({
                    name: 'Web Playback SDK',
                    getOAuthToken: cb => {
                        cb(accessToken);
                    },
                    volume: 0.5
                });

                setPlayer(player);

                player.addListener('ready', ({device_id}) => {
                    console.log('Ready with Device ID', device_id);
                    setDeviceId().then((r) => {
                        console.log("respionse from set id: ", r)
                        setIsCurrDevice(true)
                    }).catch((e) => {
                        console.error(e)
                    })

                });

                player.addListener('not_ready', ({device_id}) => {
                    console.log('Device ID has gone offline', device_id);
                });

                player.addListener('initialization_error', ({message}) => {
                    console.error(message);
                });

                player.addListener('authentication_error', ({message}) => {
                    console.error(message);
                });

                player.addListener('account_error', ({message}) => {
                    console.error(message);
                });

                player.addListener('player_state_changed', (state => {

                    if (!state) {
                        return;
                    }

                    setTrack(state.track_window.current_track);
                    setPaused(state.paused);

                    player.getCurrentState().then(state => {
                        (!state) ? setActive(false) : setActive(true)
                    });

                }));


                player.connect();

            };
        }
    }, []);

    const RenderArtistImage = () => {
        if (current_track && isCurrDevice) {
            console.log(current_track)
            return (
                <>
                    <img src={current_track.album.images[0].url}
                     className="now-playing__cover" alt="" />
                    <div className="now-playing__side">
                        <div className="now-playing__name">Track Name: {
                            current_track.name
                        }</div>

                        <div className="now-playing__artist">Artist: {
                           current_track.artists[0].name
                        }</div>
                        <div class="d-flex justify-content-center">
                        <button className="btn-spotify" class="btn btn-outline-success me-1" onClick={() => { player.previousTrack() }} >
                            Prev
                        </button>

                        <button className="btn-spotify" class="btn btn-outline-success me-1" onClick={() => { player.togglePlay() }} >
                            { is_paused ? "PLAY" : "PAUSE" }
                        </button>

                        <button className="btn-spotify" class="btn btn-outline-success me-1" onClick={() => { player.nextTrack() }} >
                            Next
                        </button></div>
                    </div>
                </>
            )
        } else {
            return (
                <>
                    <img src={Paused} height={100}
                           className="now-playing__cover" alt="" />
                    <p>Change your spotify device to Web Player SDK</p>
                </>
            )
        }
    }

    return (
        <>
            
                <div className="main-wrapper">
                    <br></br>
                   <RenderArtistImage />
                   <br></br>
                </div>
            
        </>
    );
}

export default PlaybackComponent