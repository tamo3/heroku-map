import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';

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
        <h2>Here is what returned from Express server: </h2>
        <p className="App-intro">{this.state.data}</p>
        <p>End (for debug)</p>
      </div>
    );
  }
}
  
export default App;

