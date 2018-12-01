import Axios from 'axios';
import queryString from 'query-string';
import stringSimilarity  from 'string-similarity';
import $ from 'jquery';
import Cookies from 'universal-cookie';

const linkToRedirectInDevelopment = "http://localhost:8888/login";
const linkToRedirectInProduction = "https://musico-redirect.herokuapp.com/login";

export const Port = async () => {
    const response = await fetch('/port')
    const port = await response.json()
    return port;
}

//Get the accessToken from the cookies
export const accessToken = () => {
    const cookies =  new Cookies();
    let token = cookies.get("access")
    return token;
}

export const getGeniusKey = () => {
    const cookies = new Cookies();
    let genius = cookies.get("genius");
    return genius;
}

//Get playlists promise
export const fetchPlaylists  = token => { 
    let promise = Axios('https://api.spotify.com/v1/me/playlists', {
        headers: { 'Authorization': 'Bearer ' + token },
    })
    return promise;
} 

export const fetchSongsFromPlaylist = (token, playlistId, userId) => {
    let promise = Axios(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
        headers: { 'Authorization': 'Bearer ' + token },
    })
    return promise;
}

export const SearchFor = (token, searchValue, type, limit) => {
    let promise = Axios(`https://api.spotify.com/v1/search/?q=${searchValue}&type=${type}&limit=${limit}`, {
            headers: { 'Authorization': `Bearer ${token}` },
        })
        return promise;
}
export const getDevices = (token) => {
    let promise = Axios('https://api.spotify.com/v1/me/player/devices', {
            headers: { 
                'Accept': 'application/json' ,
                'Content-Type': 'application/json' ,
                'Authorization': 'Bearer ' + token },
        })
        .catch(err => {
            if(err.response.status == 401) {
                window.location.replace(linkToRedirectInProduction)
            }
        });
        return promise;
}
export const getCurrentPlayback = (token) => {
    let promise = Axios('https://api.spotify.com/v1/me/player/currently-playing', {
            headers: { 
                'Authorization': 'Bearer ' + token },
        })
        .catch(err => console.log(err));
        return promise;
}

export const RecentlyPlayed = (token, limit) => {
    let promise = Axios('https://api.spotify.com/v1/me/player/recently-played?limit=' + limit, {
            headers: {
                'Authorization': 'Bearer ' + token },
        })
        .catch(err => console.log(err));
    return promise;
}

// export const Search = token => {

// }

export const Pause = (token) => {
    fetch('https://api.spotify.com/v1/me/player/pause', {
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer ' + token },
});
}

export const Play = (token) => {
    fetch('https://api.spotify.com/v1/me/player/play', {
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer ' + token },
});
}

export const PreviousTrack = (token) => {
    fetch('https://api.spotify.com/v1/me/player/previous', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token
        },
    })
}

export const NextTrack = (token) => {
    fetch('https://api.spotify.com/v1/me/player/next', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token },
    });
}

export const Shuffle = (token) => {
    Axios.put('https://api.spotify.com/v1/me/player/shuffle', {
        headers: {
            'Authorization': 'Bearer ' + token },
    });
}

export const SeekPosition = (token, ms) => {
    fetch('https://api.spotify.com/v1/me/player/seek?position_ms=' + ms, {
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer ' + token },
});
}
export const Volume = (token, percent) => {
    fetch('https://api.spotify.com/v1/me/player/volume?volume_percent=' + percent, {
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer ' + token },
});
}

export const Lyrics = (trackName, artist, token) => {
    let track = trackName.replace(/ *\([^)]*\) */g , "");
    track = track.replace("- Remastered [0-9]", "");
    let promise = Axios(`https://api.genius.com/search?q=${artist}-${track}`, {
        method: 'GET',
        params: {
            'Authorization': 'Bearer ' + token,
            access_token: token
        }
    })
    .catch((err) => { console.log(err) })
    return promise;
}

export const ScrapeLyrics = (url) => {
    
}

export const TransferPlayback = (token, id) => {
    fetch('https://api.spotify.com/v1/me/player', {
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer ' + token ,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "device_ids": [
              `${id}`
            ]
          })
    });
}

export const getUser = (token) => {
    let promise = Axios('https://api.spotify.com/v1/me', {
            headers: { 
                'Authorization': 'Bearer ' + token },
        })
        .catch(err => console.log(err));
        return promise;
}

export const ReportLyrics = (trackId, userId, userEmail) => {
    Axios.post('http://localhost:8888/reportLyrics', {
        data: {
            trackId: {trackId},
            userId: {userId},
            userEmail: {userEmail}
        }
    })
}

export const Featuring = (id, token) => {
    let promise = Axios(`https://api.spotify.com/v1/artists/${id}/top-tracks?country=SE`, {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    })
    return promise;
}

export const New_Releases = () => {

}

export const FeaturingPlaylists = (token) => {
    let promise = Axios(`https://api.spotify.com/v1/browse/featured-playlists`, {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    })
    return promise;
}

export const PlayTrack = (trackUri, token, deviceId) => {
    $.ajax({
        url: `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
        type: "PUT",
        data: `{"uris": ["${trackUri}"]}`,
        beforeSend: function(xhr){xhr.setRequestHeader('Authorization', `Bearer ${token}` );},
        success: function(data) { 
          console.log(data)
        }
       });  
}
// let moving = document.getElementById("background-image");
        //     const windowWidth = window.innerWidth / 2 ;
        //     const windowHeight = window.innerHeight / 2 ;
        
        //     moving.addEventListener('mousemove', (e) => {
        //     const mouseX = e.clientX / windowWidth;
        //     const mouseY = e.clientY / windowHeight;
          
        //     moving.style.transform = `translate3d(-${mouseX}%, -${mouseY}%, 0)`;
        // });