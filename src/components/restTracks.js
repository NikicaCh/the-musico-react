import React from 'react'
import $ from 'jquery'
import {accessToken, PlayTrack} from './Fetch'

class RestTracks extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            songs: [],
        }
        this.msToMins = this.msToMins.bind(this)
    }
    

    msToMins(ms) {
        let minutes = Math.floor(ms / 60000);
        let seconds = ((ms % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    }

    componentWillReceiveProps() {
        let tracks = this.props.tracks.map((track) => {
            let artists = track.artists.map((artist) => artist.name).join(",")
            return(
                <div id={track.uri} className="play-track">
                    <h1 id={track.uri}>{track.name}<h2>{artists}</h2></h1>
                    <span id={track.uri}>{this.msToMins(track.duration_ms)}</span>
                </div>
            )
        })
        this.setState({songs: tracks})
    }

    render() {
        return (
            <div className="rest-tracks">
                {this.state.songs}
            </div>
        )
    }
}

export default RestTracks;