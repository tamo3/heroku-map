import React, { Component } from 'react';
import './App.css';
import MapContainer from './Map.js';
import { Menu } from './Menu.js';



class App extends Component {
  state = {
    data: 'test',
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
      // todo: Update marker on the map?
    });
  }

  // Callback function when adding a new entry to DB.
  callbackAddData() {
    this.setState({ data: `todo: POST the new data to server.`});
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">PDX Event Map!</h1>
        </header>
        <div className="container">
          <div className="box left">
            <Menu 
              cbGetData={() => this.callbackGetData()} 
              cbAddData={() => this.callbackAddData()} 
            />  
          </div>
          <div className="box main">
            <MapContainer />
          </div>
        </div>
        <div id="debug-div">(this section is for debugging)
          <p>{this.state.data}</p>
        </div>
      </div>
    );
  }
}

export default App;

