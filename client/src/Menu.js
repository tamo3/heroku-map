import React, { Component } from 'react';
import './App.css';
// import MapContainer from './Map.js';


class Menu extends Component {
  getData(cbGotData) {
    console.log("test")
    fetch('/api')
    .then(resp => {
      console.log(resp);
      return resp.json();
    })
    .then(data => {
      console.log(data);
      cbGotData(data); // Call callback function.
    });
  }
  render() {
    return (
      <div>
        <button type="button" onClick={() => this.getData(this.props.cbGotData)} title="get data from DB">Debug Get Events</button>
        <p id="debug"></p>
      </div>
    )
  }
}

export { Menu };

