import React, {Component} from "react"
import '../App.css'
import {Port, getDevices, accessToken, getCurrentPlayback, Pause, Play, NextTrack, Shuffle, SeekPosition, Lyrics, TransferPlayback, PreviousTrack, Volume, getUser, getGeniusKey} from './Fetch'
import CookiePopUp from './cookiePopUp'
import Cookies from 'universal-cookie'
// import ReactDOM from 'react-dom';
// import getMuiTheme from 'material-ui/styles/getMuiTheme';
// import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
// import Navbar from './navbar';


import Photo from './photo'
import DisplayText from './display-text'
import LyricsDiv from './lyrics'
import Modal from './modal'
import Search from './Search'
import Spinner from './Spinner'
import stringSimilarity  from 'string-similarity'
// import scrapeIt from 'scrape-it'
import cheerio from 'cheerio'
import Axios from "../../node_modules/axios"
// import { stringify } from "querystring"
import $ from 'jquery'
import {MDCSlider} from '@material/slider'
const linkBackendInDevelopment = "http://localhost:8888/";
const linkBackendInProduction = "https://musico-redirect.herokuapp.com/";


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
            cookieUsed: false,
            context: "",
            speakerSrc: "",
            devices: []
        }
        this.getLyrics = this.getLyrics.bind(this)
        this.setCurrentTrack = this.setCurrentTrack.bind(this)
        this.toggleShuffle = this.toggleShuffle.bind(this)
        this.handleSlider = this.handleSlider.bind(this)
        this.transform = this.transform.bind(this)
        this.reverse = this.reverse.bind(this)
        this.scrapeLyrics = this.scrapeLyrics.bind(this)
        this.receiveLyrics = this.receiveLyrics.bind(this)
        this.sendToBackEnd = this.sendToBackEnd.bind(this)
        this.handleScrollLyrics = this.handleScrollLyrics.bind(this)
        this.handleKeyPress = this.handleKeyPress.bind(this)
        this.searchModal = this.searchModal.bind(this)
        this.playPause = this.playPause.bind(this)
        this.handleVolumeChange = this.handleVolumeChange.bind(this)
        this.backwards = this.backwards.bind(this)
        this.forwards = this.forwards.bind(this)
    } 
    
    forwards(secs) {
        let token = accessToken();
        getCurrentPlayback(token)
        .then(data => {
            if(data) {
                let plus = secs*1000
                let progress = data.data.progress_ms + plus
                SeekPosition(token, progress )
            }
        })
    }

    backwards(secs) {
        let token = accessToken();
        getCurrentPlayback(token)
        .then(data => {
            if(data) {
                let minus = secs*1000
                let progress = data.data.progress_ms - minus
                SeekPosition(token, progress )
            }
        })
    }
    toggleShuffle() {
        let token = accessToken();
        Shuffle(token);
    }
    async receiveLyrics() {
        const response = await fetch(linkBackendInProduction);
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
                })
            } else {
                setTimeout(() => {
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
    handleVolumeChange(value) {
        let token = accessToken();
        Volume(token, value)
    }
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
        Axios.post(linkBackendInProduction, {
                    data: {
                        url,
                        track
                    }
                })
                .then((response) => { 
                }).catch((err) => {
                    console.log(err);
                })
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
            }    
        })
    }
    setCurrentTrack(access) {
        let track = '';
        let songArtist;
        let genius = getGeniusKey();
        getCurrentPlayback(access) // get info about the current spotify playback
        .then(data => {
            if(data) {
                let playing = data.data.is_playing;
                let context = "";
                if(data.data.context) {
                    context = data.data.context.type
                    this.setState({context})
                } else {
                    context = "";
                    this.setState({context})
                }
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
    playPause() {
        let token = accessToken();
        if(this.state.playing) {
            Pause(token);
        } else {
            Play(token);
        }
    }
    handleKeyPress(e) {
        if($("#search").length) { //if the search modal is not active
            let event = e;
            let code = event.keyCode;
            let token = accessToken();
                if(code === 37 && $("#search").hasClass("hide") && this.state.context !== "") { // left arrow
                    PreviousTrack(token);
                }
                else if(code === 39 && $("#search").hasClass("hide") && this.state.context !== "") { //right arrow
                    NextTrack(token);
                }
                else if(code === 32 && $("#search").hasClass("hide")) { //space
                    this.playPause();
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

    seek(event) {
        let progress = 0;
        if(event.target.id == "seekbar-div") {
            let token = accessToken();
            progress = ((event.clientX-event.target.offsetLeft) / event.target.offsetWidth * 100);
            document.getElementById("seekbar").style.width = `${progress}%`
            let seekVal = Math.ceil((this.state.max * progress) / 100);
            SeekPosition(token, seekVal)
        } else {
            let width = event.target.style.width;
            let widthNum = width.toString().slice(0, width.length -1)
            let parent = document.getElementById("seekbar-div");
            let childX = event.pageX - parent.offsetLeft;
            progress = widthNum*childX
            let seekVal = Math.ceil((this.state.max * progress) / 100)
        }
    }
    componentDidMount() {
        document.onkeydown = this.handleKeyPress; //handle keypress
        let lastScrollTop = window.scrollTop;
        this.setState({loading: true})
        let loading = true;
        let musicoId;
        const access = accessToken();
        
        $("#volume-slider").on("change", (e) => {
            this.setState({volume: e.target.value}, () => {
                this.handleVolumeChange(this.state.volume)
            })
        })
        
        // document.getElementById('seekbar-div').addEventListener("click", function(event){
        //     getCurrentPlayback(access) // get info about the current spotify playback
        //     .then(data => {
        //         if(data) {
        //             this.setState({max: data.data.item.duration_ms}, () => {
        //                 let max = this.state.max;
        //                 let progress = (event.clientX-this.offsetLeft) / this.offsetWidth * 100;
        //                 document.getElementById("seekbar").style.width = `${progress}%`
        //                 let prog = Math.ceil(progress)
        //                 console.log("MAX", max)
        //                 let seek = (max/100)*prog
        //                 console.log(seek) 
        //                 let position = (max * progress/100);
        //                 console.log(position)
        //                 SeekPosition(access, seek)
        //             })
        //         }
        //     });
        // })
            
        getUser(access)
        .then((data) => {
            if(data) {
                this.setState({userEmail: data.data.email, userId: data.data.id}, () => {
                    let cookies = new Cookies();
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
        player.addListener('authentication_error', ({ message }) => {
            window.location.replace("https://musico-redirect.herokuapp.com/login")
            }
        );
        player.addListener('account_error', ({ message }) => { console.error("MESSAGE",message); });
        player.addListener('playback_error', ({ message }) => { console.error(message); }); 
            
        // Ready
        player.addListener('ready', ({ device_id }) => {
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
            // if(state.paused) {
            //     this.setState({playing: false})
            // } else {
            //     this.setState({playing: true})
            // }
            console.log("state change", state)
            this.setCurrentTrack(access); // SET CURRENT TRACK -------------------------------------------------
            this.setCurrentTrack(access); // I must call this func twice, because when I try to play the same song again the API returns is_playing:false
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
        let volume = this.state.volume;
        let token = accessToken();
        let src="";
        if(this.state.volume >= 60) {
            src=require("../icons/speaker loud.png")
        } else if(this.state.volume < 60 && this.state.volume > 0) {
            src=require("../icons/speaker medium.png")
        } else {
            src=require("../icons/speaker mute.png")
        }
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
                <div className="player-info">
                        {
                            this.state.context != ""
                            ? <div className="circle-upper"><img src={require("../icons/next.png")} onClick={() => NextTrack(token)}></img></div>
                            : <div></div>
                        }
                            <input
                                id="volume-slider"
                                type="range"
                                min={0}
                                max={100}
                                step={5}
                                defaultValue={volume}>
                            </input>
                    <div className="circle-left"><img src={require("../icons/rewind.png")} onClick={() => this.backwards(10)}></img></div>
                    <div className="circle-right"><img src={require("../icons/fast-forward.png")} onClick={() => this.forwards(10)}></img></div>
                    <div
                        className="player-info-circle"
                        onClick={this.playPause}>
                        <img src={ this.state.playing ? require('../icons/pause.png') : require('../icons/play.png')}></img>
                    </div>
                        {
                            this.state.context != ""
                            ? <div className="circle-down"><img src={require("../icons/back.png")} onClick={() => PreviousTrack(token)}></img></div>
                            : <div></div>
                        }
                    
                </div>
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
                <div onMouseLeave={() => {
                        $(".devices_modal").addClass("hide")
                    }}>
                    <div className="device-container" className="devices-icon"
                        onMouseEnter={() => {
                            let token = accessToken();
                            getDevices(token)
                            .then((response) => {
                                let names = response.data.devices.map((device) => {
                                    let active;
                                    let is_active = device.is_active;
                                    is_active ? active = "device_active" : active = "device_unactive"
                                    return <h3
                                        className={`device_name ${active}`} 
                                        onClick={() => {
                                        let access = accessToken();
                                        TransferPlayback(access, device.id)
                                        $(".devices_modal").addClass("hide")
                                    }}>{device.name}</h3>
                                })
                                this.setState({devices: names})
                                console.log("DEVICES",response.data.devices)
                            })
                            $(".devices_modal").removeClass("hide")
                        }}
                        ></div>
                    <div className="devices_modal hide">
                        {this.state.devices}
                    </div>
                </div>
                <div className="device-warning">Listening on device_name</div>
            </div>
        )
    }
}

export default Player;