import React, { Component } from 'react';
import './App.css';
// import MapContainer from './Map.js';


class Menu extends Component {
  getData() {
    console.log("test")
    fetch('/api')
    .then(resp => {
      console.log(resp);
      return resp.json();
    })
    .then(data => {
      console.log(data);
    });
  }
  render() {
    return (
      <div>
        <button type="button" onClick={() => this.getData()} title="get data from DB">Debug Get Events</button>
        <p id="debug"></p>
      </div>
    )
  }
}

export { Menu };

