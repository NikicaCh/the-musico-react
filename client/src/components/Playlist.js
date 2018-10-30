import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import '../App.css';
import {fetchPlaylists, accessToken, fetchSongsFromPlaylist} from './Fetch';

import Song from './Song';


class Playlist extends Component  {
    constructor(props) {
        super(props);

        this.state = {
            playlists: [], //array of user's playlists
            songs: [], //array of current playlists' songs
            userId: '' // current user's id
        }
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(event) { // When we toggle playlists from the dropdown menu
        let dropdown = document.getElementById('sel1');
        let value = dropdown.options[dropdown.selectedIndex].value;
        let token = accessToken();
        fetchSongsFromPlaylist(token, value, this.state.userId) //Call the fetchSongsFromPlaylist function, which will return a promise
        .then(data => { // Handle the promise
            console.log(data) 
            let songs = [];
            data.data.items.forEach((item) => {
                songs.push({
                    name: item.track.name,
                    id: item.track.id,
                    artistName: item.track.artists[0].name
                });
            })
            this.setState({songs: songs}); 
        })
    }
    componentDidMount() {
        let token = accessToken(); 
        fetchPlaylists(token) // Call the fetchPlaylists function, which will return a promise
        .then( data => { // Handle the promise
            let playlists = data.data.items.map( item => { // Map the id and name of the playlists in the playlists array
                return {
                    id: item.id,
                    name: item.name
                }
            })
            this.setState({ playlists: playlists, userId:data.data.items[0].owner.id})

            for(let i=0; i<this.state.playlists.length; i++) { // Loop through the playlists array state and create the dropdown options
                let element = document.createElement("option");
                element.value = playlists[i].id;
                element.innerHTML = playlists[i].name ;
                document.getElementById('sel1').append(element);
            }
        })
    }
    componentDidUpdate(){
        let songs = [];
        this.state.songs.forEach((song => {
          songs.push(<Song details={song}/>);  
        })) 
        ReactDOM.render(songs , document.getElementById('pls1')); 
    }   
         
    render() {
        return (
            <div className="row playlist-row">
                <div className="playlist">
                    <div className="form-group">
                        <label htmlFor="sel1">Select Playlist:</label>
                        <select className="form-control" id="sel1" onChange={this.handleChange}>
                        </select>
                    </div>
                    <div className="list-group" id="pls1">
                    {/* The playlist's songs go here*/}
                    </div>
                </div>
            </div>
            
        )
        }
    }


export default Playlist;