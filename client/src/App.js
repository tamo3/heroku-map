import React, { Component } from 'react';
import MapContainer from './Map.js';
import { Menu } from './Menu.js';
import './App.css';
import Client from 'predicthq';

// Client Secret : Wkuwi2B84jBH27rSfte0nAvOtI69HI7hCmVrouV4QIXm3tARXa_Sog
// Access Token : TODGDOgZORwsYmZ-n_b4-on0JaWM2Vuqn8O2K-KU
// Initialises PredictHQ client library using your access token
// Note: You can find/create your access tnoken at https://control.predicthq.com/clients
const client = new Client({access_token: 'Gg2EsEibNkluAwm9FLp21gqOLa6cmIMODSo-D2-D'});
const phqEvents = client.events;
// 10km range around the -36.844480,174.768368 geopoint
const withinParam = '10km@45.509871,-122.680712';



class App extends Component {
  constructor() {
    super();
    this.counter = 0;
  }

  state = {
    //data: 'test',           // For debug.
    eventList: [],            // event locations list.
    eventCheckboxStatus: [],  // Keep track of checkbox status, i.e. eventCheckboxStatus[2]==1, then 3rd event is checked.  
    numChecked: 0,            // Keep track of the number of checked checkboxes.  
    isMyList: false,          // Event list is from My List (DB), or from PHQ API.
  };

  componentDidMount() {
    fetch('/express_backend') // Just for test/deubg.
      .then(response => {
        return response.text();
      })
      .then(dat => {
        console.log(dat);
        this.setState({ data: `Express server returned: ${dat}` });
      })
      .catch(error => console.log(error));
  }

  // Callback function when getting data from DB. 
  callbackGetData() {
    fetch('/api') // Get event data from DB.
    .then(resp => {
      console.log(resp);
      return resp.json();
    })
    .then(jdat => {
      //this.setState({ data: JSON.stringify(jdat)}); // Print to debug area.
      const evLocations = jdat.map((item, i) => {
        const evLoc = { // An event from DB.
          title: JSON.stringify(item.name),
          location: {
            lat: item.loc.coordinates[1],
            lng: item.loc.coordinates[0]
          }
        };
        return evLoc;
      });
      this.setState({
        isMyList: true,
        eventCheckboxStatus: [],
        eventList: evLocations}); // Set the array as the new location.
    });
  }

  // Compare 2 events and return true if they are the same.
  // equals(a, b) { // Some what deep comparison. NOTE: a===b didn't work.
  //   const jc = JSON.stringify(a) === JSON.stringify(b);
  //   return jc;
  // }
 
  // Callback when event list checkbox is clicked, return number of checked.
  callbackChkClick(evItem, isMyList) {
    let stats = this.state.eventCheckboxStatus.slice();
    stats[evItem.index] = evItem.checked;
    const n = stats.reduce((acc,c) => acc + c ? 1 : 0, 0); 
    this.setState({
      numChecked: n,
      eventCheckboxStatus: stats});
  }

  // Delete all markers on Map.
  callbackDeleteMarkers() {
    this.setState({
      numChecked: 0,
      eventCheckboxStatus: [],
      eventList: []}); 
  }

  callbackFindEvents() {
    phqEvents.search({within: withinParam})
    .then((ev) => {
      // console.log(`ID=${ev.result.results[0].id} Title=${ev.result.results[0].title} loc=${ev.result.results[0].location[1]},${ev.result.results[0].location[0]}`);
      const list = ev.result.results || [];
      const evArray = list.map((x, i) => { // Create event array.
        const item = { 
          title: x.title,
          location: {
            lat: x.location[1],
            lng: x.location[0]
          }
        };
        return item;
      });
      this.setState({
        isMyList: false,
        eventCheckboxStatus: [],
        eventList: evArray}); 
    })
    .catch(err => console.error(err));
  }


  // Add a single event to DB.
  addSingleEventToDb(jdat) { // Send POST message.
    fetch('/api', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(jdat)
    }).then(resp => {
      return resp.text();
    }).then(dat => {
      console.log(`POST Request complete, resp: ${dat}`)
    }).catch(error => console.log(error));
  }

  // Delete a single event from DB.
  delSingleEventFromDb(jdat) {
    const item = {
      name: jdat.name.replace(/(^"|"$)/g, ''),
      // loc: jdat.loc, // somehow using location didn't work.
    };
    // Send DELETE message.
    fetch('/api', {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item)
    }).then(resp => {
      return resp.text();
    }).then(dat => {
      console.log(`DELETE Request complete, resp: ${dat}`)
    }).catch(error => console.log(error));
  }

  // Callback function to add/delete entries to DB.
  callbackAddDelData(evArray, add) {
    for (let i = 0; i < evArray.length; i++) {
      if (add) 
        this.addSingleEventToDb(evArray[i]);
      else 
        this.delSingleEventFromDb(evArray[i]);
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">PDX Event Map!</h1>
        </header>
        <div className="container row">
          <div className="box left col-sm-4">
            <Menu
              eventList={this.state.eventList}
              eventCheckboxStatus={this.state.eventCheckboxStatus}
              isMyList={this.state.isMyList}
              numChecked={this.state.numChecked}
              cbGetData={() => this.callbackGetData()}
              cbAddDelData={(x,a) => this.callbackAddDelData(x,a)}
              cbDelMarker={() => this.callbackDeleteMarkers()}
              cbChkClick={(x, b) => this.callbackChkClick(x, b)}
              cbFindEvents={() => this.callbackFindEvents()}
            />
          </div>
          <div className="box main col">
            <MapContainer
              eventList={this.state.eventList}
              eventCheckboxStatus={this.state.eventCheckboxStatus}
              isMyList={this.state.isMyList}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;