import React from 'react';
import {Featuring, accessToken, PlayTrack, getDevices} from './Fetch';
import $ from 'jquery';
import Cookies from 'universal-cookie';



class BestSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            featuring: [],
            deviceId: "",
            searched: "",
            type: "",
            name: ""
        }
    }


    componentDidMount() {
        let token = accessToken();
        let userId = this.props.userId;
        getDevices(token)
        .then((data) => {
            if(data) {
                data.data.devices.forEach((device) => {
                    if(device.name === `MUSICO`) {
                        let deviceId = device.id;
                        this.setState({deviceId}, () => {
                            $("body").on('click', '.play-track', (e) => {
                                let token = accessToken();
                                // let userId = this.props.userId;
                                let trackId = e.target.getAttribute('id');
                                PlayTrack(trackId, token, deviceId);
                                if(this.state.type === "artist"){
                                    let cookies = new Cookies();
                                    if(cookies.get(`mostRecent1${userId}`) !== this.state.searched) {
                                        cookies.set(`mostRecent2${userId}`, cookies.get(`mostRecent1${userId}`))
                                        cookies.set(`mostRecent1${userId}`, this.state.searched)
                                    } 
                                } else {
                                    let cookies = new Cookies();
                                    cookies.set(`lastTrack${userId}`, this.state.searched)
                                }
                            }); 
                        });
                    }
                })
            }
        })
        
    }
    componentWillReceiveProps(nextProps) {
        let token = accessToken();
        this.setState({searched: nextProps.search, type: nextProps.type, name: nextProps.max})
        if(nextProps.type == "artist") {
            Featuring(this.props.artistId, token )
            .then((data) => {
                if(data) {
                    let array = data.data.tracks.slice(0, 12).map((track) => {
                        let name = track.name
                        if(track.name.length > 20) {
                            name = track.name.substring(0, 20) +"...";
                        }
                        return  <div className="col-md-2">
                                    <div className="row w-100 ml-5 d-flex justify-content-center">
                                        <img
                                            src={track.album.images[0].url}
                                            className="featuring-img play-track mb-3"
                                            id={track.uri}>
                                        </img>
                                    </div>
                                    <div className="row w-100 ml-5 d-flex justify-content-center">
                                        <span title={track.name} className="featuring-title">{name}</span>
                                    </div>
                    </div>
                    })
                    this.setState({featuring: array})
                }
            })
        } else {
            console.log(this.props.trackId)
        }
      }
    
    render() {
        let render = this.props.image;
        let featuring = false;
        if(this.props.type == "artist") {
            featuring = true;
            let token = accessToken();
            
        } else {
            featuring = false
        }
        return (
            <div>
            {
                render
                ?   <div>
                    <div className="container w-100 search-top">
                        <div className="row w-100">
                            <div className="col-md-3 mt-5 relative"> 
                                <img id={this.props.trackId} src={this.props.image} className={`best-search-img ${this.props.type}-img`}></img>
                                {/* <img className="play-hover" src={require("../icons/play-hover.png")}></img> */}
                                <figcaption><span className="best-search-title">{this.props.name}</span></figcaption>    
                            </div>
                            <div className="col-md-9 mt-5"> 
                           {
                               featuring 
                               ?   <div>
                                        <div className="row">
                                            {this.state.featuring}
                                        </div>
                                   </div> 
                               : <div></div>
                           }
                            </div>
                        </div> 
                    </div>                        
                    </div>
                :<div></div>
            }
            </div>
        )
    }
   
}

export default BestSearch;