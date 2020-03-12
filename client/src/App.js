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
    locations: [  //todo: These are just a test data for debugging. Should be removed for production.
      { title: 'tmp FAB building', location: { lat: 45.509871, lng: -122.680712 } },
      { title: 'tmp Chopolios', location: { lat: 45.509677, lng:  -122.681626 } },
      { title: 'Transgender Clients: Assessment and Planning for Gender-affirming Medical Procedures', location: { lat: 45.481716 , lng: -122.674043 } },
    ],
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
    fetch('/api')
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

  // Delete markers on Map.
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
      console.log(`Reauest complete, resp: ${dat}`)
    })
    // todo: add catch() to handle error.
    this.setState({ data: `todo: POST the new data to server.` });
  }

  // Callback function when adding a new entry to DB.
  callbackAddData(evArray) {
    for (let i = 0; i < evArray.length; i++)
      this.addSingleEventToDb(evArray[i]);
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
              cbGetData={() => this.callbackGetData()} 
              cbAddData={(x) => this.callbackAddData(x)} 
              cbDelMarker={() => this.callbackDeleteMarkers()}
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