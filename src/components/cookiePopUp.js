import React from 'react';
import { render } from 'react-dom';
import Cookies from 'universal-cookie';
import $ from 'jquery';

const closeModal = (user) => {  
    let cookies = new Cookies();
    cookies.set(`${user}cookie`, "1");
    $(".cookie-modal").toggleClass("hide")
}

const CookiePopUp = props => {

        return (
            <div className="cookie-modal">
                <img
                    className="cookie-close"
                    src={require("../icons/pill-close.png")}
                    onClick={closeModal(props.userId)}>
                </img>
                <p>We use cookies to provide you with the best experience.By continuing to use this website, you are agreeing to the use of cookies as set in our <a href="/cookie">Cookie Policy</a>.</p>
                <img className="cookie-modal-image" src={require("../icons/cookie.png")}></img>
            </div>
        )    
}

export default CookiePopUp;

