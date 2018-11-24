import React from 'react';

class Logo extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return(
            <div className="player-logo-hover">
                 <a href="/home"><img className="musico-logo bottom" src={require("../icons/musico-logo-gold.png")}></img>
                 <img className="musico-logo top" src={require(`../icons/musico-logo${this.props.color}.png`)}></img></a>
            </div>
        )
    }
}

export default Logo;
