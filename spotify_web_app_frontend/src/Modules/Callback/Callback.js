import {completeLogin, getProfile, setProfile} from '../SpotifyHelpers/SpotifyHelpers'
import {useEffect, useState} from 'react'
import {useNavigate} from "react-router-dom";
import {callback} from "../SpotifyHelpers/SpotifyHelpers";

export default function Page() {

    const navigate = useNavigate()
    const [count, setCount] = useState(0)

    useEffect(() => {
        callback().then(({accessToken, profile}) => {
            if (accessToken && profile) {
                sessionStorage.setItem('access_token', accessToken)
                sessionStorage.setItem('profile', profile)
                navigate('/connections')
            }
            // else {
            //     navigate('/login', {state: {error: 'Error loggin into spotify'}})
            // }

        }).catch((e) => {
            console.error(e)
        })
    }, [])

    return (
        <div>
            <div>
                <title>Logging you in...</title>
                <meta name="robots" content="noindex" />
            </div>

            <div  />

            <main className="p-2 flex flex-col max-w-xs mx-auto my-4 text-center space-y-4">
                <h1 className="text-4xl text-gray-600 animate-pulse">
                    Logging you in...
                </h1>
            </main>
        </div>
    )
}