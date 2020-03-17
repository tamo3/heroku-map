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
    data: 'test',
    locations: [],            // event locations list.
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
      console.log(jdat);
      this.setState({ data: JSON.stringify(jdat)}); // Print to debug area.
      let evLocations = []; // New array.
      jdat.forEach(item =>{
        console.log("Name: ", item.name);
        this.setState({ data: JSON.stringify(item.name)});
        console.log("Location Coordinates: ", item.loc.coordinates);
        const evLoc = { // An event from DB.
          title: JSON.stringify(item.name),
          location: {
            lat: item.loc.coordinates[1],
            lng: item.loc.coordinates[0]
          }
        };
        evLocations.push(evLoc); // Add to the array.
      })
      this.setState({
        isMyList: true,
        locations: evLocations}); // Set the array as the new location.
    });
  }

  // Compare 2 events and return true if they are the same.
  equals(a, b) {
    // Some what deep comparison. NOTE: a===b didn't work.
    const jc = JSON.stringify(a) === JSON.stringify(b);
    return jc;
  }

  // Add or delete a single Marker.

  // todo: this logic is not working anymore -- need to refine!
  callbackAddDelMarker(evItem, add) {
    const match = this.state.locations.filter(x => this.equals(x, evItem));
    // const match = this.state.locations.filter(x => x === evItem);
    if (add && match.length === 0) { // Add mode && the event hasn't been added.
      let evLocations = this.state.locations.slice(0); // Copy locations.
      evLocations.push(evItem);
      this.setState({locations: evLocations});
    }
    else if (!add && match.length > 0) { // Del mode && the event is in the list.
      const evLocations = this.state.locations.filter((x) => !this.equals(x, evItem));
      this.setState({locations: evLocations});
    }
  }

  // Callback when event list checkbox is clicked, return number of checked.
  callbackChkClick(evItem, isMyList) {
    let stats = this.state.eventCheckboxStatus.slice();
    stats[evItem.index] = evItem.checked;
    if (isMyList) {
      // todo: what to do? For now, don't do anything. Would be nice if we could change the color of Marker.
    }
    else {
      this.callbackAddDelMarker(evItem, evItem.checked);
    }
    const n = stats.reduce((acc,c) => acc + c ? 1 : 0, 0); 
    this.setState({
      numChecked: n,
      eventCheckboxStatus: stats});
  }

  // Delete all markers on Map.
  callbackDeleteMarkers() {
    this.setState({locations: []}); 
  }

  callbackFindEvents() {
    phqEvents.search({within: withinParam})
    .then((ev) => {
      // logEventsToConsole(ev);
      console.log(ev.result.results.length);
      console.log(`ID=${ev.result.results[0].id} Title=${ev.result.results[0].title} loc=${ev.result.results[0].location[1]},${ev.result.results[0].location[0]}`);
      this.setState({
        isMyList: false,
        eventCheckboxStatus: [],
        locations: ev.result.results}); // Assign the result array to eventList.
    })
    .catch(err => console.error(err));
  }


  // Add a single event to DB.
  addSingleEventToDb(jdat) {
    // Send POST message.
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

  // Callback function to add entries to DB.
  callbackAddData(evArray) {
    for (let i = 0; i < evArray.length; i++)
      this.addSingleEventToDb(evArray[i]);
  }
  // Callback function to delete entries from DB.
  callbackDelData(evArray) {
    for (let i = 0; i < evArray.length; i++)
      this.delSingleEventFromDb(evArray[i]);
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
              locations={this.state.locations}
              eventCheckboxStatus={this.state.eventCheckboxStatus}
              numChecked={this.state.numChecked}
              eventList={this.state.locations}
              isMyList={this.state.isMyList}
              cbGetData={() => this.callbackGetData()} 
              cbAddData={(x) => this.callbackAddData(x)} 
              cbDelData={(x) => this.callbackDelData(x)}
              cbDelMarker={() => this.callbackDeleteMarkers()}
              cbChkClick={(x,b) => this.callbackChkClick(x,b)}
              cbFindEvents={() => this.callbackFindEvents()}
            />  
          </div>
          <div className="box main col">
            <MapContainer locations={this.state.locations}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;