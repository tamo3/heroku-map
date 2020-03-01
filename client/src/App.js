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
        <div className="container">
          <div className="box left">
            <p>Left box<br/>
            todo: add menu</p>
          </div>
          <div className="box main">
            <h3>Express server returned: {this.state.data}</h3>
            <MapContainer />
          </div>
        </div>
        <div id="debug-div">(this section is for debugging)</div>
      </div>
    );
  }
}
  
export default App;

