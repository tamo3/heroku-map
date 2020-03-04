import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
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
      <button type="button" class="dash-button btn btn-primary mb-1" onClick={() => this.getData(this.props.cbGetData)} title="get data from DB">Debug Get Events</button>
      <button type="button" class="dash-button btn btn-primary" onClick={() => this.addData(this.props.cbAddData)} title="add data to DB">Debug Add Event</button>
      <p id="debug"></p>
    </div>


    )
  }
}

export { Menu };

