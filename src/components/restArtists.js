import React from 'react'


class RestArtists extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            artists: ""
        }
    }

    componentWillReceiveProps() {
        let artists = this.props.artists.map((artist) => {
            let source;
            if(artist.images.length !== 0) {
                source = artist.images[0].url
            } else {
                source="http://abs2018.lbsafricaclub.org/wp-content/uploads/2016/03/profile-placeholder.png"
            }
            return(
                <div className="rest-artist-div col-md-4 col-xs-6">
                    <img src={source}></img>
                    <div className="row">
                        <h1>{artist.name}</h1>
                    </div> 
                </div>
            )
        })
        this.setState({artists})
    }

    render() {
        return(
            <div className="container">
                <div className="rest-artists row">
                    {this.state.artists}
                </div>
            </div>
        )
    }
}


export default RestArtists;