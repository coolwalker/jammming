import React, { Component } from 'react';
import './App.css';
import SearchResults from '../SearchResults/SearchResults';
import  SearchBar from '../SearchBar/SearchBar';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      searchResults: [],
      playlistName: 'New Playlist',
      playlistTracks: []
    }
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    }

  addTrack(track){
    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
     return;
      }
    
      const newplaylistTracks = this.state.playlistTracks.concat(track);
      this.setState({
        playlistTracks: newplaylistTracks
      });
    }

    removeTrack(track) {
      const newPlaylistTracks = this.state.playlistTracks.filter(savedTrack => savedTrack.id !== track.id);
      this.setState({
        playlistTracks: newPlaylistTracks
      });
    }

    updatePlaylistName(name) {
      this.setState(
        {playlistName: name}
      );
    }

    savePlaylist(){
      const trackURIs = this.state.playlistTracks.map(track => track.uri); 
      Spotify.savePlaylist(this.state.playlistName, trackURIs);
    }

    search(term){
      Spotify.search(term).then(tracks => {
        this.setState({
          searchResults: tracks
        });
      });
    }

  render() {
              return (
                <div>
                  <h1>Ja<span className="highlight">mmm</span>ing</h1>
                <div className="App">
                  <SearchBar onSearch={this.search}/>
                <div className="App-playlist">
                  <SearchResults searchResults = {this.state.searchResults} onAdd = {this.addTrack} />
                  <Playlist playlistName = {this.state.playlistName} playlistTracks = {this.state.playlistTracks} 
                  onSave = {this.savePlaylist} onRemove = {this.removeTrack} onNameChange={this.updatePlaylistName}/> 
                </div>
              </div>
            </div>
              
    );
  }
}

export default App;
