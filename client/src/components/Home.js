import React, {Component} from 'react';
import '../App.css';
import {accessToken, RecentlyPlayed} from './Fetch';
import Result from './searchResults/Result';
import Navbar from './navbar';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            RecentlyPlayed: [],
        }
    }
    componentDidMount(){
        // let token = accessToken();
        // let array = [];
        // RecentlyPlayed(token, 6)
        // .then((data) => {
        //     array = data.data.items.map((item) => <Result type="top-songs" name={item.track.name} image={item.track.album.images[0].url} uri={item.track.external_urls.spotify} token={this.state.token} />);
        //     console.log(data)
        //     this.setState({RecentlyPlayed: array})
        // }) 
        window.onload = () => {
            document.querySelector(".home-title").className="home-title title-active";
        }
    }
    render() {
        return (
            <div className="home">
                <div class="home-title">
                    <span className="title-1">The</span><span className="title-2">MUSICO</span>
                </div>
                <img className="musico-logo" src={require("../icons/musico-logo.png")}></img>
                <span className="search-div">search</span>
                <Navbar />
            </div>
            // <div className="home-page">
            //     <div className="home text-center">
            //         <div className="start pt-5">
            //             <h1 className="heading display-1 text-dark">spotify yourself with <i className="musico">MUSICO</i></h1>
            //             <h1 className="lead font-italic pt-3 musico">And we will provide you with the Lyrics.</h1>
            //             <button
            //                 onClick={() => window.location.href="/start/?access_token="+ this.props.token}
            //                 type="button" 
            //                 className="startButton btn btn-lg btn-outline-secondary mt-5">Open App
            //             </button>
            //         </div>
            //     </div>
            //     <div className="homePageContent">
            //         <div className="row col-lg-12">
            //         {this.state.RecentlyPlayed}
            //         </div> 
            //     </div>
            // </div>
        )
    }
    
}

export default Home;