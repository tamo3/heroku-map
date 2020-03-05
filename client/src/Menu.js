import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Client from 'predicthq';
// Initialises PredictHQ client library using your access token
// Note: You can find/create your access tnoken at https://control.predicthq.com/clients
const client = new Client({access_token: 'Gg2EsEibNkluAwm9FLp21gqOLa6cmIMODSo-D2-D'});
// import MapContainer from './Map.js';

const phqEvents = client.events;

const logEventsToConsole = events => {
  for (const event of events) {
    // See https://developer.predicthq.com/resources/events/#fields for list of all event fields.
    console.log(event);
    console.log();
  }
};

// 10km range around the -36.844480,174.768368 geopoint
const withinParam = '10km@45.509871,-122.680712';

// Event search using `within` parameter.
// See https://developer.predicthq.com/resources/events/#parameters for all available search parameters.
phqEvents.search({within: withinParam})
  .then(logEventsToConsole)
  .catch(err => console.error(err));

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

