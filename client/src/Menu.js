import React, { Component } from 'react';
import './App.css';
// import MapContainer from './Map.js';


class Menu extends Component {
  getData(cbGetData) {
    cbGetData(); // Call callback function.
  }
  addData(cbAddData) {
    cbAddData(); // Call callback function.
  }

  render() {
    return (
      <div>
        <button type="button" onClick={() => this.getData(this.props.cbGetData)} title="get data from DB">Debug Get Events</button>
        <button type="button" onClick={() => this.addData(this.props.cbAddData)} title="add data to DB">Debug Add Event</button>
        <p id="debug"></p>
      </div>
    )
  }
}

export { Menu };

