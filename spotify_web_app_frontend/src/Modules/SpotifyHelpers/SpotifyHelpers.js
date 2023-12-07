import {post} from "axios";

export async function redirectToAuthCodeFlow(clientId) {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    sessionStorage.setItem("verifier", verifier);

    const params = new URLSearchParams();
    params.append("client_id", '4e8f8455d67249839bef6a8dc50cabb7');
    params.append("response_type", "code");
    params.append("redirect_uri", "http://localhost:3000/callback");
    params.append("scope", `user-read-private
                                        user-read-email
                                        user-modify-playback-state
                                        user-read-playback-state 
                                        user-read-currently-playing,
                                        streaming
                                        `);
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

export async function loginUser() {
    const clientId = "4e8f8455d67249839bef6a8dc50cabb7";

    await redirectToAuthCodeFlow(clientId);

}

export async function callback() {
    const clientId = "4e8f8455d67249839bef6a8dc50cabb7";
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const accessToken = await getAccessToken(clientId, code);
    console.log("ACCESS TOKENs: ",accessToken)
    const profile = await fetchProfile(accessToken)


    return {profile: JSON.stringify(profile), accessToken}
}

export async function getAccessToken(clientId, code) {
    const verifier = sessionStorage.getItem("verifier");

    const params = new URLSearchParams();
    params.append("client_id", '4e8f8455d67249839bef6a8dc50cabb7');
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", "http://localhost:3000/callback");
    params.append("code_verifier", verifier);
    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        body: params
    });
    const {access_token, refresh_token} = await result.json();
    sessionStorage.setItem('refresh_token', refresh_token)

    return access_token;
}

function generateCodeVerifier(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

async function generateCodeChallenge(codeVerifier) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

async function fetchProfile(code) {
    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET", headers: {Authorization: `Bearer ${code}`}
    });

    return await result.json();
}

export async function fetchCurrentSong() {
    let access_token = sessionStorage.getItem('access_token')
   try {
       const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
           headers: {
               Authorization: 'Bearer ' + access_token
           }
       })
       return await response.json()
   } catch(e) {
        return -1
   }
}

export async function playCurrentSong() {
    let access_token = sessionStorage.getItem('access_token')
    try {
        const response = await fetch('https://api.spotify.com/v1/me/player/play', {
            method: "PUT",
            headers: {
                Authorization: 'Bearer ' + access_token
            }
        })
        return await response.json()
    } catch(e) {
        return -1
    }
}

export async function setCurrentSong(uri) {
    let access_token = sessionStorage.getItem('access_token')
    // console.log("URI IN CURR SONG", uri)
    // let uris = JSON.stringify([uri])
    const device_id = await getCurrentDeviceIdLocal()
    const q = new URLSearchParams({
        device_id: device_id
    })

    try {
        const uri_to_send = []
        uri_to_send.push(uri)
        console.log("URI TO SEND: , ", uri_to_send[0])
        const response = await fetch(`https://api.spotify.com/v1/me/player/play?${q}`, {
            method: "PUT",
            headers: {
                Authorization: 'Bearer ' + access_token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "uris": uri_to_send })
        })
        console.log('response set song: ',await response.json())
        return await response.json()
    } catch(e) {
        console.log("RESONSE ERROR: ", e)

        return -1
    }
}

export async function getCurrentDeviceId() {
    let access_token = sessionStorage.getItem('access_token')
    try {
        const response = await fetch('https://api.spotify.com/v1/me/player/devices', {
            method: "GET",
            headers: {
                Authorization: 'Bearer ' + access_token
            }
        })
        const data = await response.json()
        const deviceId = data.devices.find((d) => d.name === 'Web Playback SDK').id
        const set_response = await setCurrentDeviceId(deviceId)
        console.log("response ion get curr device id: ", set_response)
        return await response.json()
    } catch(e) {
        return -1
    }
}

async function getCurrentDeviceIdLocal() {
    let access_token = sessionStorage.getItem('access_token')
    try {
        const response = await fetch('https://api.spotify.com/v1/me/player/devices', {
            method: "GET",
            headers: {
                Authorization: 'Bearer ' + access_token
            }
        })
        const data = await response.json()
        const deviceId = data.devices.find((d) => d.name === 'Web Playback SDK').id
        return deviceId
    } catch(e) {
        return -1
    }
}

export async function setCurrentDeviceId(deviceId) {
    let access_token = sessionStorage.getItem('access_token');
    const device_ids = [deviceId];
    try {
        const response = await fetch('https://api.spotify.com/v1/me/player/', {
            method: "PUT",
            headers: {
                Authorization: 'Bearer ' + access_token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ device_ids })
        });
        return await response.json();
    } catch (e) {
        return -1;
    }
}

export async function searchSongs(songToSearch) {
    let access_token = sessionStorage.getItem('access_token');
    const q = new URLSearchParams({
        q: songToSearch,
        type: 'track'
    })
    try {
        const response = await fetch(`https://api.spotify.com/v1/search?${q}`, {
            method: "GET",
            headers: {
                Authorization: 'Bearer ' + access_token,
                'Content-Type': 'application/json'
            },
            // body: JSON.stringify({ q })
        });
        return await response.json();
    } catch (e) {
        return -1;
    }
}

export async function setItemToQueue(uri) {
    let access_token = sessionStorage.getItem('access_token');
    const deviceId = await getCurrentDeviceIdLocal()
    const q = new URLSearchParams({
        uri: uri,
        device_id: deviceId
    })
    try {
        const response = await fetch(`https://api.spotify.com/v1/me/player/queue?${q}`, {
            method: "POST",
            headers: {
                Authorization: 'Bearer ' + access_token,
                'Content-Type': 'application/json'
            },
            // body: JSON.stringify({ q })
        });
        return await response.json();
    } catch (e) {
        return -1;
    }
}

export async function setProfile(profile) {
    sessionStorage.setItem('profile', profile)
}
