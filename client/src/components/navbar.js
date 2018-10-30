import React from 'react';
import '../App.css';

const Navbar = props => {

    return (
        <div className="navigation">
            <ul>
                <li><a>Explore</a></li>
                <li><a>About</a></li>
                <li><a>Player</a></li>
                <li><a>Contact Us</a></li>
                <li><a>Search</a></li>
            </ul>
        </div>
    )
}

export default Navbar;