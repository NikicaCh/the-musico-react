'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');
var scrapeIt = require("scrape-it");
var bodyParser = require('body-parser');
var request = require('request');
var querystring = require('querystring');
var Axios = require("axios");
var fetch = require("node-fetch");
var $ = require("jquery");
var cookieParser = require("cookie-parser");
// use it before all route definitions

var url = "";
var prevUrl = "";
var lyrics = "";
var track = "";
var access_token = "";
var refresh_token = "";
var genius = "";

var app = express();
var port = process.env.PORT || 3001;

var redirect_uri = process.env.REDIRECT_URI || 'http://localhost:3001/callback';
var code = "";

app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use(cookieParser());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

app.get('/login', function (req, res) {
    res.redirect('https://accounts.spotify.com/authorize?' + querystring.stringify({
        response_type: 'code',
        client_id: process.env.SPOTIFY_CLIENT_ID,
        scope: "user-modify-playback-state user-read-currently-playing user-library-modify streaming user-read-email user-follow-read user-read-private user-library-read playlist-read-private user-read-playback-state app-remote-control playlist-read-collaborative user-read-recently-played user-read-birthdate playlist-modify-public playlist-modify-private user-follow-modify user-top-read",
        redirect_uri: redirect_uri
    }));
});
app.get('/callback', function (req, res) {
    code = req.query.code || null;
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code: code,
            redirect_uri: redirect_uri,
            grant_type: 'authorization_code'
        },
        headers: {
            'Authorization': 'Basic ' + new Buffer(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')
        },
        json: true
    };
    request.post(authOptions, function (error, response, body) {
        access_token = body.access_token;
        refresh_token = body.refresh_token;
        genius = process.env.GENIUS_API_KEY;
        var uri = process.env.FRONTEND_URI || 'http://localhost:3000';
        res.cookie("access", access_token);
        console.log(access_token);
        res.cookie("genius", genius);
        res.redirect(uri);
    });
});

app.post('/', function (req, res) {
    if (req.body.data.url !== url) {
        res.set('Content-Type', 'application/json');
        var jsonData = (0, _stringify2.default)(req.body);
        res.status(201);
        res.json();
        url = req.body.data.url;
        track = '';
        scrapeIt(url, {
            lyrics: '.lyrics p'
        }).then(function (data) {
            if (data) {
                lyrics = data.data.lyrics;
                track = req.body.data.track;
                console.log("scraped", req.body.data.track);
            } else {
                console.log("Lyrics unavailable");
            }
        });
    }
});

app.get("/", function (req, res) {
    var object = {
        url: url,
        lyrics: lyrics,
        track: track
    };
    res.send({ scraped: object });
});
app.post("/reportLyrics", function (req, res) {
    res.set('Content-Type', 'application/json');
    res.json();
    var data = req.body;
    console.log(data.data.trackId);
});

app.listen(port, function () {
    return console.log('Listening on port ' + port);
});