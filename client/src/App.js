import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react'

const mapKey = 'AIzaSyBdBb3UJJAFYHU76vXhd_sBoSdvVJk6WaI';
// class MyMap extends Component {
//   render() {
//     return (
//       <div className="MyMap">
//         Hello World!
//         <Map google={this.props.google} />
//       </div>
//     )
//   }
// }

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
        <Map google={this.props.google} />
        <div id="debug-div">(for debugging)</div>
      </div>
    );
  }
}
  
// export default App;
export default GoogleApiWrapper({
  apiKey: (mapKey)
 })(App);

