import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Client from 'predicthq';

var print = 1;

// Client Secret : Wkuwi2B84jBH27rSfte0nAvOtI69HI7hCmVrouV4QIXm3tARXa_Sog
// Access Token : TODGDOgZORwsYmZ-n_b4-on0JaWM2Vuqn8O2K-KU
// Initialises PredictHQ client library using your access token
// Note: You can find/create your access tnoken at https://control.predicthq.com/clients
const client = new Client({access_token: 'Gg2EsEibNkluAwm9FLp21gqOLa6cmIMODSo-D2-D'});
// import MapContainer from './Map.js';

const phqEvents = client.events;

const logEventsToConsole = events => {
  for (const event of events) {
    // See https://developer.predicthq.com/resources/events/#fields for list of all event fields.
    //console.log(event);
    
    Object.keys(event).forEach(function(key){
      console.log(event[key]);
      document.getElementById("json").innerHTML = JSON.stringify(event[key], undefined, 2);
    });

    if (print === 0) {
      document.getElementById("json").innerHTML = JSON.stringify(events, undefined, 2);
    }
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
      <div>
        <button type="button" class="dash-button btn btn-primary mb-1" onClick={() => this.getData(this.props.cbGetData)} title="get data from DB">Debug Get Events</button>
        <button type="button" class="dash-button btn btn-primary" onClick={() => this.addData(this.props.cbAddData)} title="add data to DB">Debug Add Event</button>   
      </div>
      <br></br>
      <div>
        <table class="table table-bg">
          <thead class="thead-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Event</th>
              <th scope="col">Location</th>
              <th scope="col">Time</th>
            </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">1</th>
                <td>Test Event</td>
                <td>Portland, OR</td>
                <td>8AM</td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>Test Event</td>
                <td>Portland, OR</td>
                <td>8AM</td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td>Test Event</td>
                <td>Portland, OR</td>
                <td>8AM</td>
              </tr>
              </tbody>
          </table>
        </div>
    </div>
    )
  }
}

export { Menu };
