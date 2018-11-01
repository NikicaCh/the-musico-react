import React from 'react';
import '../App.css';

const Navbar = props => {

    return (
        <div className="navigation">
            <ul>
                <li><a href="/explore">Explore</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="/">Player</a></li>
                <li><a href="/contact">Contact Us</a></li>
            </ul>
        </div>
    )
}

export default Navbar;