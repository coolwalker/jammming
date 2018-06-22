import React, { Component } from 'react';
import './SearchBar.css';

class SearchBar extends Component {

    constructor(props){
        super(props);
        this.search = this.search.bind(this);
        this.handleTermChange = this.handleTermChange.bind(this);

        this.state = {
            term:''
        }
    }

    search(){
       // console.log(this.state.term);
        this.props.onSearch(this.state.term);
    }

    handleTermChange(event){
        event.preventDefault();
            this.setState(
                {
                    term: event.target.value
                }
            );
           // console.log(this.state.term);
    }

    render() {
        return (
            <div className="SearchBar">
                <input onChange = {this.handleTermChange} placeholder="Enter A Song, Album, or Artist" />
                <a onClick={this.search} >SEARCH</a>
            </div>
        );
    }
}

export default SearchBar;