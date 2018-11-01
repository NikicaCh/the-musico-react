import React, {Component} from "react";
import '../App.css';
import {getDevices, accessToken, getCurrentPlayback, Pause, Play, NextTrack, Shuffle, SeekPosition, Lyrics, TransferPlayback, PreviousTrack, Volume, getUser, getGeniusKey} from './Fetch';
import CookiePopUp from './cookiePopUp';
import Cookies from 'universal-cookie';
// import ReactDOM from 'react-dom';
// import getMuiTheme from 'material-ui/styles/getMuiTheme';
// import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
// import Slider from 'material-ui/Slider';
// import Navbar from './navbar';


import Photo from './photo';
import DisplayText from './display-text';
import LyricsDiv from './lyrics';
import Modal from './modal';
import Search from './Search';
import Spinner from './Spinner';
import stringSimilarity  from 'string-similarity';
// import scrapeIt from 'scrape-it';
import cheerio from 'cheerio';
import Axios from "../../node_modules/axios";
// import { stringify } from "querystring";
import $ from 'jquery';
import computerName from 'computer-name';


class Player extends Component {
    constructor(props) {
        super(props);
        this.state = {
            playing: true,
            currentDevice: [],
            currentPlaybackName: '',
            currentImage: '',
            currentArtist: '',
            trackId: '',
            userEmail: '',
            userId: '',
            currentDuration: 0,
            min: 0,
            max: 10000,
            power: 0.3,
            slider: 0,
            currentLyrics: '',
            currentLyricsUrl: '',
            musicoId: '',
            loading: false, 
            display: '',
            fullLyrics: [],
            lyricsPosition: 0,
            changedSong: 0,
            volume: 100,
            numberofParagraphs: 0,
            cookieUsed: false
        }
        this.getLyrics = this.getLyrics.bind(this);
        this.setCurrentTrack = this.setCurrentTrack.bind(this);
        this.toggleShuffle = this.toggleShuffle.bind(this);
        this.handleSlider = this.handleSlider.bind(this);
        this.transform = this.transform.bind(this);
        this.reverse = this.reverse.bind(this);
        this.scrapeLyrics = this.scrapeLyrics.bind(this);
        this.receiveLyrics = this.receiveLyrics.bind(this);
        this.sendToBackEnd = this.sendToBackEnd.bind(this);
        this.handleScrollLyrics = this.handleScrollLyrics.bind(this);
        // this.showLeftModal = this.showLeftModal.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.searchModal = this.searchModal.bind(this)
    } 
    toggleShuffle() {
        let token = accessToken();
        Shuffle(token);
    }
    async receiveLyrics() {
        const response = await fetch('http://localhost:3001');
        const body = await response.json();
    
        if (response.status !== 200) throw Error(body.message);
        
            let track = body.scraped.track;
            if(track === this.state.currentPlaybackName) {
                let paragraphs = body.scraped.lyrics.split("\n\n");
                let finished = [];
                let numberofParagraphs = paragraphs.length;
                paragraphs.map((paragraph) => {
                    let lines = paragraph.split("\n")
                    let separated = lines.map((line) => {
                        return <p className="line">{line}</p>
                   })
                   if(lines.length < 10 ) {
                        finished.push(<div>{separated}</div>)
                   } else {
                        let numberOfNewParagraphs = Math.ceil(lines.length / 10);
                        numberofParagraphs += numberOfNewParagraphs -1;
                        for(let i=0; i<numberOfNewParagraphs; i++) {
                            let ten = separated.slice(i*10, i*10 + 10);
                            finished.push(<div>{ten}</div>)
                        }
                   }
                   this.setState({numberofParagraphs})
                })
                this.setState({currentLyrics: finished[0], lyricsPosition: 0,  fullLyrics: finished}, () => {
                    console.log("4 TRY SUCCEDED")
                })
            } else {
                setTimeout(() => {
                    console.log("4 TRY FAILED");
                    this.receiveLyrics();
                }, 50)
                
            }
            
    }
    //----------------------------------------- SLIDER --------------------------------
    handleSlider(event, value) {
        let token = accessToken();
        this.setState({slider: this.transform(value)});
        SeekPosition(token, value);
    };
    transform(value) {
      return Math.round((Math.exp(this.state.power * value / this.state.max) - 1) / (Math.exp(this.state.power) - 1) * this.state.max);
    }
    
    reverse(value) {
      return (1 / this.state.power) * Math.log(((Math.exp(this.state.power) - 1) * value / this.state.max) + 1) * this.state.max;
    }
    async scrapeLyrics(url) {
        const response = await fetch(url);
        const text = await response.text();
        const $ = cheerio.load(text);
        return $('.lyrics p')
          .text()
          .trim();
      }
    sendToBackEnd(url, track) {
        Axios.post("http://localhost:3001", {
                    data: {
                        url,
                        track
                    }
                })
                .then((response) => { 
                }).catch((err) => {
                    console.log(err);
                })
                console.log("3", track)                
    }
    getLyrics(track, artist, token) {
        //LYRICS ------------------------------------------------------------------------------------
         Lyrics(track, artist, token)
        .then((data) => {
            let hitsName = [];
            let hitsObject = [];
            let hit;
            data.data.response.hits.map((hit) => {
                hitsObject.push(hit.result);
                hitsName.push(hit.result.full_title);
            })
            if(hitsName.length) { // if the genius api responds with a result
                console.log("2")
                if($("#lyrics-main").hasClass("hide")) {
                    $("#lyrics-main").toggleClass("hide")
                }
                let lyrics = stringSimilarity.findBestMatch(track, hitsName);
                hitsObject.forEach((object) => {
                    if(object.full_title === lyrics.bestMatch.target) {
                        hit = object;
                    }
                })
                this.setState({currentLyricsUrl: hit.url}, () => {
                    this.sendToBackEnd(this.state.currentLyricsUrl, track)
                    this.receiveLyrics();
                })
            } else {
                if(!$("#lyrics-main").hasClass("hide")) {
                    $("#lyrics-main").toggleClass("hide")
                }
                console.log("2 Genius api responded with no lyrics, try to find lyrics in the database... to be constructed yet")
            }    
        })
    }
    setCurrentTrack(access) {
        console.log("1")
        let track = '';
        let songArtist;
        let genius = getGeniusKey();
        getCurrentPlayback(access) // get info about the current spotify playback
        .then(data => {
            console.log(data)
            if(data) {
                let playing = data.data.is_playing;
                this.setState({playing})
                if(data.data.item) {
                    this.setState({trackId: data.data.item.id})
                }
                // this.setState({trackId: data.data.item.id})
                let lastPlayed;
                if(data.status === 200) {
                    let artists = [];
                    let artistsCopy = data.data.item.artists.map((artist) => artist.name);
                    let artist = artistsCopy.join(" \n ");
                    data.data.item.artists.map((artist) => {
                        artists.push(<span className="artistName">{artist.name}</span>)
                        artists.push(<br />);
                    });
                    if(data.data.item.name !== this.state.currentPlaybackName) {
                        lastPlayed = {
                            name: data.data.item.name,
                            image: data.data.item.album.images[0].url,
                            artist: artists,
                            duration: data.data.item.duration_ms
                        }
                        document.cookie = lastPlayed;
                        this.setState({
                            currentPlaybackName: data.data.item.name,
                            currentImage: data.data.item.album.images[0].url,
                            currentArtist: artists,
                            max: data.data.item.duration_ms
                        }, () => {
                            track = data.data.item.name;
                            songArtist = artist;
                            this.getLyrics(track, songArtist, genius);
                        });
                        document.title = this.state.currentPlaybackName;
                    }
                } else {
                    console.log("NO DATA")
                }
            }
            let display = '';
            let toDisplay = this.state.currentPlaybackName.replace(/ *\([^)]*\) */g, "");
                    if(toDisplay.length > 20){
                        display = toDisplay.toUpperCase().substring(0,20) + '...';
                        this.setState({display: display})
                    } else {
                        display = toDisplay.toUpperCase();
                        this.setState({display: display})
                    }
        });                  
    }
    handleScrollLyrics(e) {
        if($("#search").length && $("#search").hasClass("hide")) {
            if (e.deltaY < 0) { //scroll up
                if( this.state.fullLyrics && this.state.lyricsPosition > 0) {
                    this.setState({ lyricsPosition: this.state.lyricsPosition -1}, () => {
                        this.setState({currentLyrics: this.state.fullLyrics[this.state.lyricsPosition]})
                    })}
                }
              if (e.deltaY > 0) { //scroll down
                if( this.state.fullLyrics && this.state.lyricsPosition < this.state.fullLyrics.length -1) {
                    this.setState({ lyricsPosition: this.state.lyricsPosition +1}, () => {
                        this.setState({currentLyrics: this.state.fullLyrics[this.state.lyricsPosition]})
                    })}     
            }
        }  
    }
    handleKeyPress(e) {
        console.log(e.keyCode)
        if($("#search").length) { //if the search modal is not active
            let event = e;
            console.log(event.keyCode)
            let code = event.keyCode;
            let token = accessToken();
                if(code === 37 && $("#search").hasClass("hide")) { // left arrow
                    PreviousTrack(token);
                }
                else if(code === 39 && $("#search").hasClass("hide")) { //right arrow
                    NextTrack(token);
                }
                else if(code === 32 && $("#search").hasClass("hide")) { //space
                    if(this.state.playing) {
                        this.setState({playing: false}, () => Pause(token));
                    } else {
                        this.setState({playing: true}, () => Play(token));
                    }
                }
                else if(code === 40 && $("#search").hasClass("hide")) { //down arrow
                    if(this.state.volume > 0) {
                        this.setState({volume: this.state.volume - 5}, () => {
                            Volume(token, this.state.volume)
                            // let image = document.createElement("img");
                            // image.setAttribute('src', require("../icons/speaker-down.png"));
                            // image.setAttribute('class', "player-icon");
                            // document.getElementById("app").appendChild(image)
                        })
                    }
                } else if(code === 38 && $("#search").hasClass("hide")) { //up arrow
                    if(this.state.volume < 100) {
                        this.setState({volume: this.state.volume + 5}, () => {
                            Volume(token, this.state.volume)
                        })
                    }
                } else if(code === 27 && !$("#search").hasClass("hide")) { //esc
                    $("#search").toggleClass("hide")
                } else if(code === 83 && $("#search").hasClass("hide")) { //s
                    this.searchModal();
                }      
        }        
    }
    searchModal() {
        $("#search").toggleClass("hide")
    }
    componentDidMount() {
        document.onkeydown = this.handleKeyPress; //handle keypress
        let lastScrollTop = window.scrollTop;
        this.setState({loading: true})
        let loading = true;
        let musicoId;
        const access = accessToken();
        let computer = computerName();
        getUser(access)
        .then((data) => {
            if(data) {
                this.setState({userEmail: data.data.email, userId: data.data.id}, () => {
                    let cookies = new Cookies();
                    console.log("HERE IT IS", cookies.get(`${this.state.userId}cookie`))
                    if(cookies.get(`${this.state.userId}cookie`) == 1) {
                        this.setState({cookieUsed: true})
                    } else {
                        this.setState({cookieUsed: false})
                    }
                })
            }
        })
        document.querySelector("body").addEventListener("wheel", this.handleScrollLyrics)
        //PLAYBACK SDK ------------------------------------------------------------------------------------
        const script = document.createElement("script");

        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);
        window.onSpotifyWebPlaybackSDKReady = () => {
            const token = access;
            const player = new window.Spotify.Player({
              name: `MUSICO`,
              getOAuthToken: cb => { cb(token); }
            });

        player.addListener('initialization_error', ({ message }) => { console.error(message); });
        player.addListener('authentication_error', ({ message }) => { window.location.replace("http://localhost:3001/login") });
        player.addListener('account_error', ({ message }) => { console.error(message); });
        player.addListener('playback_error', ({ message }) => { console.error(message); }); // Try to figure out how to let the use know about this errors
            
        // Ready
        player.addListener('ready', ({ device_id }) => {
            console.log('Ready with Device ID', device_id);
            loading = false;
            this.setState({loading: false})
            this.setCurrentTrack(access); // SET CURRENT TRACK --------------------------------------------------
            this.setCurrentTrack(access); // I must call this func twice, because when I try to play the same song again the API returns is_playing:false
            getDevices(access)
            .then((data) => {
                if(data) {
                    data.data.devices.forEach((device) => {
                        if(device.name === `MUSICO`) {
                            musicoId = device.id;
                            this.setState({musicoId});
                        }
                    })
                }
            })
            .then(() => {
                TransferPlayback(access, this.state.musicoId);
            })
        });

        // Playback status updates
        player.addListener('player_state_changed', state => { 
            console.log("STATE CHANGED")
            // if(state.paused) {
            //     this.setState({playing: false})
            // } else {
            //     this.setState({playing: true})
            // }
            this.setCurrentTrack(access); // SET CURRENT TRACK -------------------------------------------------
            let url;
                
        });

        // Not Ready
        player.addListener('not_ready', ({ device_id }) => {
            console.log('Device ID has gone offline', device_id);
        });

        // Connect to the player!
        player.connect();
        }
  }   
    componentWillUnmount() {
        window.removeEventListener('wheel', this.handleScrollLyrics);
    }
    render() {
        let loading = this.state.loading;
        return (
            <div id="player-div">
                {loading 
                ? <Spinner /> 
                :<div ref={"player"} id="player" className="player">
                <Search
                    deviceId={this.state.musicoId}
                    playing={this.state.playing}
                    userId={this.state.userId}/>
                <DisplayText
                    name={this.state.display}
                    class={'songName'} 
                />
                <DisplayText
                    name={this.state.currentArtist}
                    class={"artists"} 
                />
                {/* <DisplayText name={this.state.currentArtist} class={'artistName'} /> */}
                <Photo
                    src={this.state.currentImage} 
                />              
                </div>
                }
                <LyricsDiv
                    lyrics={this.state.currentLyrics}
                    lyricsModal = {this.state.fullLyrics}
                    track={this.state.currentPlaybackName}
                    trackId={this.state.trackId}
                    userId={this.state.userId}
                    userEmail={this.state.userEmail}
                    numberofParagraphs={this.state.numberofParagraphs}
                    lyricsPosition={this.state.lyricsPosition}
                />
                {
                    this.state.cookieUsed
                    ?<div></div>
                    :<CookiePopUp
                    userId={this.state.userId}/>
                }
                
                <div id="for-modals"></div>
                {
                    (this.state.playing)
                    ? <span></span>
                    :<div className="paused-div fade-in">
                        <span className="paused-indicator">Paused</span>
                        <span className="pause-help">Press "Space" to resume</span>
                    </div>
                }
                
            </div>
        )
    }
}

export default Player;