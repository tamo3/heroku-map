import React, { Component } from 'react';
import './App.css';
import MapContainer from './Map.js';
import { Menu } from './Menu.js';



class App extends Component {
  state = {
    data: 'test',
  };

  componentDidMount() {
    //console.log("aa");
    fetch('/express_backend')
      .then(response => {
        // console.log("bb");
        return response.text();
      })
      .then(dat => {
        console.log(dat);
        console.log("cc");
        this.setState({ data: dat });
      })
      .catch(error => console.log(error));
  }

  // Callback function when data is arrived.

  calllbackGotData(dat) {
    console.log(dat);
    this.setState({ data: JSON.stringify(dat)}); // Print to debug area.
    // Update marker on the map?
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">PDX Event Map!</h1>
        </header>
        <div className="container">
          <div className="box left">
            <Menu cbGotData={(dat) => this.calllbackGotData(dat)} />  
          </div>
          <div className="box main">
            <MapContainer />
          </div>
        </div>
        <div id="debug-div">(this section is for debugging)
          <p>Express server returned: {this.state.data}</p>
        </div>
      </div>
    );
  }
}

export default App;

