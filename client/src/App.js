import React, { Component } from 'react';
import './App.css';
import MapContainer from './Map.js';


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
        this.setState({data: dat});
      })
      .catch(error => console.log(error));
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">PDX Event Map!</h1>
        </header>
        <h3>Here is what returned from Express server: </h3>
        <p className="App-intro">{this.state.data}</p>
        <MapContainer  />
        <div id="debug-div">(for debugging)</div>
      </div>
    );
  }
}
  
export default App;

