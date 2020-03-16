import React, { Component } from 'react';
import MapContainer from './Map.js';
import { Menu } from './Menu.js';
import './App.css';



class App extends Component {
  constructor() {
    super();
    this.counter = 0;
  }

  state = {
    data: 'test',
    locations: [],            // event locations list.
    eventCheckboxStatus: [],  // Keep track of checkbox status, i.e. eventCheckboxStatus[2]==1, then 3rd event is checked.    
  };

  componentDidMount() {
    fetch('/express_backend')
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
      this.setState({locations: evLocations}); // Set the array as the new location.
    });
  }

  // Compare 2 events and return true if they are the same.
  equals(a, b) {
    // Some what deep comparison. NOTE: a===b didn't work.
    const jc = JSON.stringify(a) === JSON.stringify(b);
    return jc;
  }

  // Add or delete a single Marker.
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
    this.setState({eventCheckboxStatus: stats});
    if (isMyList) {
      // todo: what to do? For now, don't do anything. Would be nice if we could change the color of Marker.
    }
    else {
      this.callbackAddDelMarker(evItem, evItem.checked); // Call App.js/callbackAddDelMarker().
    }
    const n = stats.reduce((acc,c) => acc + c ? 1 : 0, 0); 
    return n;
  }

  // Delete all markers on Map.
  callbackDeleteMarkers() {
    this.setState({locations: []}); 
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
              cbGetData={() => this.callbackGetData()} 
              cbAddData={(x) => this.callbackAddData(x)} 
              cbDelData={(x) => this.callbackDelData(x)}
              cbDelMarker={() => this.callbackDeleteMarkers()}
              cbChkClick={(x,b) => this.callbackChkClick(x,b)}
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