import React from 'react'
import queryString from 'query-string'


const Login = () => {
    let redirect_uri = "http://localhost:3000/callback"
    let query = {
        response_type: 'code',
        client_id: "73fcd0fee54c4f9f93247aaf6f42a92f",
        scope: "user-modify-playback-state user-read-currently-playing user-library-modify streaming user-read-email user-follow-read user-read-private user-library-read playlist-read-private user-read-playback-state app-remote-control playlist-read-collaborative user-read-recently-played user-read-birthdate playlist-modify-public playlist-modify-private user-follow-modify user-top-read",
        redirect_uri
    }
    window.location.replace('https://accounts.spotify.com/authorize?'+
    queryString.stringify(query))
}


export default Login;