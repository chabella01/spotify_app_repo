import {post} from "axios";

export async function redirectToAuthCodeFlow(clientId) {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem("verifier", verifier);

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

    const profile = await fetchProfile(accessToken)


    return {profile: JSON.stringify(profile), accessToken}
}

export async function getAccessToken(clientId, code) {
    const verifier = localStorage.getItem("verifier");

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

    const {access_token} = await result.json();

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
    let access_token = localStorage.getItem('access_token')
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
    let access_token = localStorage.getItem('access_token')
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
    let access_token = localStorage.getItem('access_token')
    try {
        const response = await fetch('https://api.spotify.com/v1/me/player/play', {
            method: "PUT",
            headers: {
                Authorization: 'Bearer ' + access_token
            },
            body: {
                uris: uri
            }
        })
        return await response.json()
    } catch(e) {
        return -1
    }
}

async function getCurrentDeviceId() {

}


export async function setProfile(profile) {
    localStorage.setItem('profile', profile)
}
