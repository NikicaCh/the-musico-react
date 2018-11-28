import React from 'react'
import { render } from 'react-dom';

class RestTracks extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            names: ""
        }
    }

    componentDidMount() {
        let names = this.props.tracks.map((track) => track.name)
        this.setState({names})
    }

    render() {
        return (
            <div className="rest-tracks">
                <div>
                    <h1>When the party's over</h1>
                </div>
                <div>
                    <h1>When the party's over</h1>
                </div>
                <div>
                    <h1>When the party's over</h1>
                </div>
                <div>
                    <h1>When the party's over</h1>
                </div>
            </div>
        )
    }
}

export default RestTracks;