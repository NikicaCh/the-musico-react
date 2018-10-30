import React from 'react';
import {Play, Pause, accessToken} from './Fetch';

class PlayerInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playing: "",
        }
        this.playPause = this.playPause.bind(this)
    }

    playPause() {
        let token = accessToken();
        if(this.state.playing) {
            Pause(token);
            this.setState({playing: false});
        } else {
            Play(token);
            this.setState({playing: true});
        }
    }

    componentDidMount() {
        this.setState({playing: this.props.playing})
    }

    render() {
        return (
            <div className="player-info-circle" onClick={this.playPause}>
                {/* <img src={require(`../icons/${playing}.png`)}></img> */}
            </div>
        )
    }
}

export default PlayerInfo;