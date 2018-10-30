

const Playback = () => {
    const script = document.createElement("script");
    let state = 0;

        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);
        window.onSpotifyWebPlaybackSDKReady = () => {
            const token = 'BQCmR6DthAoRcmiArTeFruxNdsQGbpZAdoN2X3JASeLerwzJxXD29zNCtCr2MY-7SDJ6XpXHVCj9qyWhiOVhrQa6KbfaWrwKAzkuoPcxqY3KYcBc2ud29rsrkqJ4TXaKzu9CZ9RJ_sFm7ckBTPoc3d3V54OPSaYX4XOClP0qmQ_uBf1Gl75EA_8hbw';
            const player = new window.Spotify.Player({
              name: 'MUSICO',
              getOAuthToken: cb => { cb(token); }
            });

  player.addListener('initialization_error', ({ message }) => { console.error(message); });
  player.addListener('authentication_error', ({ message }) => { console.error(message); });
  player.addListener('account_error', ({ message }) => { console.error(message); });
  player.addListener('playback_error', ({ message }) => { console.error(message); });

  // Playback status updates
  player.addListener('player_state_changed', state => { 
    console.log("HERE",state); 
    state = 1;
  });

  // Ready
  player.addListener('ready', ({ device_id }) => {
    console.log('Ready with Device ID', device_id);
    state = 2;
  });

  // Not Ready
  player.addListener('not_ready', ({ device_id }) => {
    console.log('Device ID has gone offline', device_id);
  });

  // Connect to the player!
  player.connect();
        }
        return state;
  }

export default Playback;