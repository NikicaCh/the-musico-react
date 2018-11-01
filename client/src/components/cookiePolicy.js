import React from 'react';

class CookiePolicy extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    componentDidMount() {

    }

    render() {
        return(
            <div className="cookies">
                <img className="cookie-image" src={require("../icons/cookie.png")}></img>
                <div className="cookie-policy">
                                <h2>Cookies</h2>
                                    <p>To make this site work properly, we sometimes place small data files called cookies on your computer. Most big websites do this too.</p>
                                    <h3>What are cookies ?</h3>
                                        <p>A cookie is a small text file that a website saves on your computer when you visit the site. It enables the website to remember your actions and preferences (such as favourite tracks, recently listened charts and other display preferences) over a period of time, so you don’t have to keep re-entering them whenever you come back to the site or browse from one page to another.</p>
                                    <h3>How do we use cookies?</h3>
                                        <p>Adjust this part of the page according to your needs. Explain which cookies you usein plain, jargon-free language. In particular:</p>
                                    <ul>
                                        <li>their purpose and the reason why they are being used, (e.g. to remember users' actions, to identify the users' prefered tracks)</li>
                                        <li>if they are essential for the website or a given functionality to work or if they aim to enhance the performance of the website</li>
                                        <li>the types of cookies used (permanent)</li>
                                        <li>who controls/accesses the cookie-related information (website)</li>
                                        <li>that the cookie will not be used for any purpose other than the one stated</li>
                                        <li>how consent can be withdrawn.</li>
                                </ul>
                                    <h3>How to control cookies?</h3>
                                        <p>You can control and/or delete cookies as you wish – for details, see <a href="https://aboutcookies.org" target="_blank">aboutcookies.org</a>. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed. If you do this, however, you may not be able to experience the website the way it was imagined and some services and functionalities may not work.</p>
                </div>
            </div>
        )
    }
}

export default CookiePolicy;