
const clientId = '';
const redirectUri = 'http://localhost:3000/';
let accessToken;
let tokenExpiry;

const Spotify = {
    getSpotifyToken(){
    
        if(accessToken !== undefined){
            return accessToken;
        }
        else if(window.location.href.includes('access_token')){
            
            accessToken = window.location.href.match('access_token=([^&]*)')[1];
            tokenExpiry = window.location.href.match('expires_in=([^&]*)')[1];  
            
            window.setTimeout(()=> accessToken = '', tokenExpiry * 1000);
            window.history.pushState('Access Token',null,'/');
            return accessToken;

        }
        else {
            window.location.assign(`https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`);
        }
    },

    search(term){
        const token = this.getSpotifyToken();
        

        return fetch(`https://api.spotify.com/v1/search?type=track&q=${encodeURI(term)}`,{
                headers: {
                    Authorization: `Bearer ${token}`
                } 
            }).then(response => {
                return response.json();
            }).then(jsonResponse => {
               
                if(jsonResponse.tracks) {
                    return jsonResponse.tracks.items.map(track => ({
                        id:track.id,
                        name: track.name,
                        artist: track.artists[0].name,
                        album: track.album.name,
                        uri: track.uri
                    }));
                }
            });
        
    },

    savePlaylist(name, trackUris) {
        if (!name || !trackUris.length) {
          return;
        }

        const accessToken = this.getSpotifyToken();

        const headers = { Authorization: `Bearer ${accessToken}` };
        let userId;

        return fetch('https://api.spotify.com/v1/me', {headers: headers}
        ).then(response => response.json()
        ).then(jsonResponse => {
          userId = jsonResponse.id;
          return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
            headers: headers,
            method: 'POST',
            body: JSON.stringify({name: name})
          }).then(response => response.json()
          ).then(jsonResponse => {
            const playlistId = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
              headers: headers,
              method: 'POST',
              body: JSON.stringify({uris: trackUris})
            });
          });
        });
      }
}

export default Spotify;

