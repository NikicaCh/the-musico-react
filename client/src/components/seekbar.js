import React from 'react'
import {accessToken, SeekPosition} from './Fetch'


class Seekbar extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            duration: 0
        }
        this.seek = this.seek.bind(this)
    }

    seek(event) {
        let progress = 0;
        if(event.target.id == "seekbar-div") {
            let token = accessToken();
            progress = ((event.clientX-event.target.offsetLeft) / event.target.offsetWidth * 100);
            document.getElementById("seekbar").style.width = `${progress}%`
            let seekVal = Math.ceil((this.state.duration * progress) / 100);
            console.log(seekVal)
            SeekPosition(token, seekVal)
        } else {
            let width = event.target.style.width;
            let widthNum = width.toString().slice(0, width.length -1)
            let parent = document.getElementById("seekbar-div");
            let childX = event.pageX - parent.offsetLeft;
            progress = widthNum*childX
            let seekVal = Math.ceil((this.state))
            console.log(progress)
        }
    }

    componentDidMount () {
        
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.duration !== this.state.duration) {
            this.setState({duration: nextProps.duration})
            // document.getElementById("seekbar").style.width = `0%`
        } else {
            let seconds = nextProps.duration/100;
            

            document.getElementById("seekbar").style.width = "100%";
            document.getElementById("seekbar").style.transition = `width ${seconds}s`
            // setInterval(() => {
            //     console.log("HAHA")
            // }, seconds)

            // this.setState({duration: nextProps.duration})
            // console.log("HAHAHH", seconds)
            // setInterval(() => {
            //     width = document.getElementById("seekbar").style.width
            //     let widthNum = parseInt(width.slice(0, width.length -1));
            //     let sum = 1 + widthNum;
            //     // document.getElementById("seekbar").style.width = `${sum}%`
            //     // console.log("HAHAHH", oneSec)
            // }, 10000)
        }
        this.setState({duration: nextProps.duration})
        
    }
    


    render() {
        return(
            <div>
                <div id="seekbar-div" onClick={this.seek.bind(this)}>
                    <div id="seekbar">
                        <span></span>
                    </div>
                </div>
            </div>
        )
    }


}


export default Seekbar;