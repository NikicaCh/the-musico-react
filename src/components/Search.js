import React, { Component } from 'react'
import queryString from 'query-string'
import $ from "jquery"

import Result from './searchResults/Result'
import {accessToken, SearchFor, FeaturingPlaylists} from './Fetch'
import BestSearch from './bestSearch'
import Cookies from 'universal-cookie'
import FeaPlaylists from './featuringPlaylists'


class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
          searchValue:'',
          type: "",
          track: "",
          artist: "",
          max: "",
          maxImg: "",
          noData1: false,
          noData2: false,
          trackId: "",
          artistId: "",
          playlistScrolling: false,
          restTracks: [],
          restArtists: []

        }
        this.handleChange = this.handleChange.bind(this);
        this.search = this.search.bind(this);
        // this.handleKeyPress = this.handleKeyPress.bind(this);
    };
    search(token, value) {
        SearchFor(token, value, "track", 50)
            .then((data) => {
                if(data && data.data && data.data.tracks && data.data.tracks.items){
                    let array = data.data.tracks.items
                    if(array.length) {
                        let maxPop = Math.max.apply(Math, array.map(function(track) { return track.popularity; }))
                        let mostPopularTrack = array.find((track) => { return track.popularity === maxPop}) // the most popular track object
                        this.setState({track: mostPopularTrack, trackId:mostPopularTrack.uri, restTracks: array})
                    } 
                } else {
                    this.setState({noData1: true})
                }
            })
            SearchFor(token, value, "artist", 50)
            .then((data) => {
                if(data && data.data && data.data.artists && data.data.artists.items) {
                    let array = data.data.artists.items;
                    if(array.length) {
                        let maxPop = Math.max.apply(Math, array.map(function(artist) { return artist.popularity; }))
                        let mostPopularArtist = array.find((artist) => { return artist.popularity === maxPop}) // the most popular artist object
                        this.setState({artist: mostPopularArtist, artistId: mostPopularArtist.id, restArtists: array}, () => { // after both track and artist search finishes
                            let trackPop = this.state.track.popularity;
                            let artistPop = this.state.artist.popularity;
                            
                            if(artistPop + 5 >= trackPop && this.state.artist.images.length) {
                                this.setState({max: this.state.artist.name, maxImg: this.state.artist.images[0].url, type: "artist"})
                            } else if(trackPop > artistPop && this.state.track.album.images && this.state.track.album.images.length) {
                                this.setState({max: this.state.track.name, maxImg: this.state.track.album.images[0].url, type: "track"})
                            }
                        })
                    }
                } else {
                    this.setState({noData2: true}, () => {
                        if(this.state.noData1 == true) {
                            this.setState({track: "", artist: "", max: "", maxImg: "", type: ""});
                        }
                    })
                }
            })    
    }
    handleChange(event) {
        let value = $(".search-input").val();
        if(value == "") {
            this.setState({track: "", artist: "", max: "", maxImg: "", type: "", noData1: false, noData2: false})
        }
        $(".search-inner").addClass("search-searched")
        $(".search-title").addClass("title-searched")
        $(".pills-row").addClass("pills-searched")
        $(".results").attr("class", "results")
        let token = accessToken();
        this.setState({searchValue: value}, () => {
            this.search(token, value);
        }) 
               
    }
    // handleKeyPress(e) {
    //     let code = e.keyCode;
    //     let token = accessToken();
    //     if(code == 27 && !$("#search").hasClass("hide")) {
    //         $("#search").toggleClass("hide")
    //     }
    // }
    componentDidMount() {
        // document.onkeydown = this.handleKeyPress; //handle keypress
        $(".search-close").on("click", () => $("#search").toggleClass("hide"))
        let value = $(".search-input").val();
        let token = accessToken();
        $(".search-inner").addClass("search-searched")
        $(".search-title").addClass("title-searched")
        $(".pills-row").addClass("pills-searched")
        $(".results").attr("class", "results")
        if(!$("#search").hasClass("hide")) {
            this.setState({searchValue: value}, () => {
                this.search(token, value);
            }) 
        }
        $("body").on("click", ".pill-close", (e) => {
            e.target.parentNode.remove()
        })
        $(".pill").on("click", (e) => {
            if(e.target.id === "pill1" || e.target.id === "pill2" || e.target.id === "pill3") { //if you click pill 1, 2 or 3
                this.setState({searchValue: value}, () => {
                    let value = e.target.innerText;
                    let token = accessToken();
                    $(".search-inner").addClass("search-searched")
                    $(".search-title").addClass("title-searched")
                    $(".pills-row").addClass("pills-searched")
                    $(".results").attr("class", "results")
                    this.search(token, value);
                    this.setState(this.state); //this is because sometimes it happens that the component doesn't rerender after a pill is clicked
                }) 
            } else if(e.target.id === "pill5") { //if you click pill 5
                FeaturingPlaylists(token)
                .then(data => console.log(data.data.playlists.items))
            }
        }) 
    }
    render() {
        let cookies = new Cookies();
        let userId = this.props.userId
        let mostRecent1 = cookies.get(`mostRecent1${userId}`)
        if(!mostRecent1 || mostRecent1 == "undefined") {
            mostRecent1 = "imagine dragons"
        }
        let mostRecent2 = cookies.get(`mostRecent2${userId}`)
        if(!mostRecent2 || mostRecent2 == "undefined") {
            mostRecent2 = "Drake"
        }
        let lastTrack = cookies.get(`lastTrack${userId}`)
        if(!lastTrack || lastTrack == "undefined") {
            lastTrack = "shallow"
        }
        let type;
        if(this.state.type === "track") {
            type = "play-track track"
        } else {
            type = this.state.type;
        }
        let value = this.state.searchValue;
        return (
            <div id="search" className="search hide">
            <img
                className="search-close"
                src={require("../icons/pill-close.png")}>
            </img>
                <div className="row">
                    <span className="search-title">Search here</span>
                </div>
                <div className="row search-inner">
                    <input 
                        value={this.state.searchValue}
                        className="search-input ml-5"
                        type="text"
                        onChange={this.handleChange}
                        placeholder="type to search">
                    </input>
                    <button className="search-btn">
                        <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
                        </svg>
                    </button>
                </div>
                <div className="row pills-row">
                    <span id="pill1" className="pill">{mostRecent1}<img className="pill-close" src={require("../icons/pill-close.png")}></img></span>
                    <span id="pill2" className="pill">{mostRecent2}<img className="pill-close" src={require("../icons/pill-close.png")}></img></span>
                    <span id="pill3" className="pill">{lastTrack}<img className="pill-close" src={require("../icons/pill-close.png")}></img></span>
                    <span id="pill4" className="pill">new_releases<img className="pill-close" src={require("../icons/pill-close.png")}></img></span>
                    <span id="pill5" className="pill">featuring<img className="pill-close" src={require("../icons/pill-close.png")}></img></span>
                </div>
                <div className="row">
                    { value
                    ? <span className="search-indicator">Press Enter to search for "{value}"</span>
                    : <span></span>
                    }
                </div>
                <div>
                <div className="results hide">
                    <BestSearch
                            type={type}
                            image={this.state.maxImg}
                            name={this.state.max}
                            artistId={this.state.artistId}
                            deviceId={this.props.deviceId}
                            trackId={this.state.trackId} 
                            userId={this.props.userId}
                            search={this.state.searchValue}
                            restTracks={this.state.restTracks}
                            restArtists={this.state.restArtists}/>
                    {/* <FeaPlaylists /> */}
                    <div></div>
                </div>                
                </div>
            </div>
        );
    };

}

export default Search;