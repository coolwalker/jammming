
const clientId = '6ab94da50cb643f78183fc86f0cdfeb8';
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

    savePlaylist(playlistname, tracks){

        let userId, playlistId;

        if(playlistname === undefined || tracks === undefined) {
            return;
        }
        //fetching token to use in subsequent calls
        const token = this.getSpotifyToken();
        let header = {
            'Authorization': `Bearer ${token}`,
            'Content-type': 'application/json'
        };
        
        //Fetching current logged in user's id
         fetch('https://cors-anywhere.herokuapp.com/https://api.spotify.com/v1/me', {
             headers: {
            Authorization: `Bearer ${token}`
        }
                }).then(response => {
                    if(response.ok){
                    return response.json()
                }
            }).then(jsonResponse => {
                 userId = jsonResponse.id;
            }, error => {
                throw(new Error);
            });
             
       

        const data = JSON.stringify({
                name: playlistname,
                public: false

        });
       
      

        //Creating an empty playlist in user's account with the playlist name parameter
         fetch(`https://cors-anywhere.herokuapp.com/https://api.spotify.com/v1/users/${userId}/playlists`,
        {
            method:'POST',
            headers: header,
            body: data

        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
                playlistId =  jsonResponse.id;
        });

        console.log(playlistId);

        const playlistTracks = JSON.stringify(
            {
                uris: tracks
            }
        );

        /*

        //Finally, adding the array of tracks to the newly created spotify playlist
         fetch(`https://cors-anywhere.herokuapp.com/https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,
        {
            method: 'POST',
            headers:header,
            body: playlistTracks   
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            if(jsonResponse.playlist) {
                return jsonResponse.id;
            }
        });

        
       */
    }

};

export default Spotify;

