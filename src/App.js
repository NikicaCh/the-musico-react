import React, { Component } from 'react';
import {Route, BrowserRouter, Switch, Redirect, Router} from 'react-router-dom';
import {browserHistory} from "react-router";
import {accessToken} from './components/Fetch';
import Cookies from 'universal-cookie';
import Axios from 'axios';
import $ from 'jquery';
import './App.css';
import queryString from 'query-string';

import Search from './components/Search';
import Playlist from './components/Playlist';
import Home from './components/Home';
import Player from './components/Player';
import Navbar from './components/navbar';
import AboutPage from './components/AboutPage';
import CookiePolicy from './components/cookiePolicy'
import Login from './components/Login'
import Callback from './components/Callback'



//import components
import Logo from './components/logo'
import SearchButton from './components/searchButton'


class App extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      token: '',
      refresh: 0,
    }
    this.handleRedirect = this.handleRedirect.bind(this);
    this.refresToken = this.refresToken.bind(this);
  }

  handleRedirect = () => {
    window.location.replace("http://localhost:3001/login");
  }
  refresToken = async () => {
    const response = await fetch('http://localhost:3001/token');
    const json = await response.json();
    const cookies = new Cookies();
    cookies.remove("access", ["Expires=Thu, 01 Jan 1970 00:00:01 GMT;"])
    cookies.set("access", json.access_token)
  }
  
  componentDidMount() {
    document.title = "Musico";
    const linkToRedirectInDevelopment = "http://localhost:8888/login";
    const linkToRedirectInProduction = "https://musico-redirect/login";
    let date = new Date();
    Date.prototype.addHours= function(h){
      this.setHours(this.getHours()+h);
      return this;
    } //to add one hour on access_date cookie
    const cookies = new Cookies();

    let parsed = queryString.parse(document.location.search)
    if(parsed.spotify) {
      cookies.set("access", parsed.spotify)
      cookies.set("genius", parsed.genius)
      cookies.set("access_time", date.toString())
      window.location.replace("/")
    } else if(!cookies.get("access_time") || cookies.get("access_time").toString() < new Date().toString()) {
      window.location.replace(linkToRedirectInProduction)   
    }
    let access_token = accessToken()
    this.setState({token: access_token})
    this.timer = setInterval(() =>  {
      window.location.replace(linkToRedirectInProduction)   
    }, 3500000);
  }
  componentWillUnmount() {
    const cookies = new Cookies();
    cookies.remove("access", ["Expires=Thu, 01 Jan 1970 00:00:01 GMT;"])
  }
  render() {
    return (
      <div id="app" className="App">        
        <BrowserRouter>
          <Switch>
           { /*The home route */}
            <Route exact path="/home" render ={ () => {
              return(
                <div>
                  <Logo color="" />
                  <Home token={this.state.token} />
                </div>
              );
            }
            }
            />
            <Route exact path="/about" component={AboutPage} />
            <Route exact path="/cookie" component={CookiePolicy} />
            <Route exact path="/" render = { () => {
              return (
                <div>
                  <Logo color={"-black"} />
                  <SearchButton color={"-black"} />
                  <Player/>
                </div>
                );
              }
            }
            />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
