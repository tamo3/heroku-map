import React, { Component, useState } from 'react';
import './App.css';
import MapContainer from './Map.js';
import { Menu } from './Menu.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal } from 'react-bootstrap';


function Example() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Launch demo modal
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

class App extends Component {
  state = {
    data: 'test',
    locations: [  //todo: These are just a test data for debugging. Should be removed for production.
      { title: 'tmp FAB building', location: { lat: 45.509871, lng: -122.680712 } },
      { title: 'tmp Chopolios', location: { lat: 45.509677, lng:  -122.681626 } },
      { title: '"Transgender Clients: Assessment and Planning for Gender-affirming Medical Procedures', location: { lat: 45.481716 , lng: -122.674043 } },
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
      jdat.forEach(item =>{
        console.log("Name: ", item.name);
        this.setState({ data: JSON.stringify(item.name)});
        console.log("Location Coordinates: ", item.loc.coordinates)
      })
      // todo: Update marker on the map?
    });
    // todo: add catch() to handle error.
  }

  // Callback function when adding a new entry to DB.
  callbackAddData() {
    const jdat = {
      start: '',
      end: '',
      name: 'tmp event1',
      loc: {
        type: "Point",
        coordinates: [-122.697687, 45.526974]  // [lng, lat] -- different from Google Map!  Need to swap!
      },
      web: '',
      desc: ''
    };
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
    this.setState({ data: `todo: aaPOST the new data to server.`});
  }

  togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup
    });
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
            <Example />          
            <MapContainer locations={this.state.locations} />
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

