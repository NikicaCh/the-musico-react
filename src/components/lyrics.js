import React, {Component} from "react" ;
import $ from 'jquery';
import DropDown from './dropdown';
import {ReportLyrics} from './Fetch';

class LyricsDiv extends Component {
    constructor(props) { // props: the lyrics object, the spotify id of the song
        super(props);
        this.state = {

        }
        this.showModal = this.showModal.bind(this);
        this.report = this.report.bind(this);
    }
    showModal() {
        console.log("RIGHT MODAL");
        // document.getElementById("settings").className="lyrics-icon settings-logo settings-rotate";
        $("#settings").toggleClass("settings-rotate")
        $(".dropdown").toggleClass("hide")
    }
    componentDidMount() {

    }

    report = () => {
        ReportLyrics(this.props.trackId, this.props.userId, this.props.userEmail)
    }
    render() {
        let loaded = this.props.lyrics;
        return(
            <div>
            { loaded
                ? <div className="lyrics-holder">
                    <div id="lyrics-main" className="lyrics-main">
                    <div className="lyrics-icons">
                        <div className='icon-scroll'></div>
                        <img
                            id="settings"
                            className="lyrics-icon settings-logo"
                            src={require("../icons/settings.png")}
                            onClick={this.showModal}>
                        </img>
                        <div className="paragraph-indicator">
                            <span>{this.props.lyricsPosition +1}</span>/<span>{this.props.numberofParagraphs }</span> 
                        </div>
                        <DropDown
                            reportLyrics={this.report}
                            track={this.props.track}
                            lyrics={this.props.lyricsModal}
                        /> 
                    </div>
                    {this.props.lyrics} </div>
                </div>
                :
                <p></p>}
            </div>
            
            
        )
    }
}

export default LyricsDiv;