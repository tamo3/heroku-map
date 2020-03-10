import React, { Component, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal } from 'react-bootstrap';
import Client from 'predicthq';
import './App.css';
import logo from './logo.svg';


// Client Secret : Wkuwi2B84jBH27rSfte0nAvOtI69HI7hCmVrouV4QIXm3tARXa_Sog
// Access Token : TODGDOgZORwsYmZ-n_b4-on0JaWM2Vuqn8O2K-KU
// Initialises PredictHQ client library using your access token
// Note: You can find/create your access tnoken at https://control.predicthq.com/clients
const client = new Client({access_token: 'Gg2EsEibNkluAwm9FLp21gqOLa6cmIMODSo-D2-D'});
// import MapContainer from './Map.js';

const phqEvents = client.events;

const logEventsToConsole = events => {
  for (const event of events) {
    console.log(event);
    console.log();
    // See https://developer.predicthq.com/resources/events/#fields for list of all event fields.
    
    /*document.getElementById("json").innerHTML = JSON.stringify(event, undefined, 2);

    Object.keys(event).forEach(function(key){
      console.log(event[key]);
      document.getElementById("json").innerHTML = JSON.stringify(event[key], undefined, 2);
    });*/
  }
};

// 10km range around the -36.844480,174.768368 geopoint
const withinParam = '10km@45.509871,-122.680712';

// Event search using `within` parameter.
// See https://developer.predicthq.com/resources/events/#parameters for all available search parameters.
phqEvents.search({within: withinParam})
  .then(logEventsToConsole)
  .catch(err => console.error(err));

class Menu extends Component {

  getData(cbGetData) {
    cbGetData(); // Call callback function.
  }
  addData(cbAddData) {
    cbAddData(); // Call callback function.
  }

  togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup
    });
  }
 
  render() {
    return (
    <div>
      <div >
        <div className="row mb-1 "><button type="button" className="dash-button btn btn-block btn-primary" onClick={() => this.getData(this.props.cbGetData)} title="get data from DB">Debug Get Events</button></div>
        <div className="row mb-1 "><button type="button" className="dash-button btn btn-block btn-primary" onClick={() => this.addData(this.props.cbAddData)} title="add data to DB">Debug Add Event</button>   </div>
        <div className="row mb-1 "><About /></div>  
      </div>
      <br></br>
      <div>
        <table className="table table-bg">
          <thead className="thead-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Event</th>
              <th scope="col">Location</th>
              <th scope="col">Time</th>
            </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">1</th>
                <td>Test Event</td>
                <td>Portland, OR</td>
                <td>8AM</td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>Test Event</td>
                <td>Portland, OR</td>
                <td>8AM</td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td>Test Event</td>
                <td>Portland, OR</td>
                <td>8AM</td>
              </tr>
              <tr>
                <th scope="row">4</th>
                <td>Test Event</td>
                <td>Portland, OR</td>
                <td>8AM</td>
              </tr>
              <tr>
                <th scope="row">5</th>
                <td>Test Event</td>
                <td>Portland, OR</td>
                <td>8AM</td>
              </tr>
              </tbody>
          </table>
        </div>
        <form>
          <div class="form-group">
            <label className="event-name">Event Name</label>
            <input type="name" class="form-control" id="event_name" aria-describedby="emailHelp" placeholder="Event Name"></input>
          </div>
          <div className="form-group">
            <label for="event-location">Event Location</label>
            <input type="location" class="form-control" id="event_location" placeholder="Event Location"></input>
          </div>
          <div class="form-group">
            <label className="event-time">Event Time</label>
            <input type="time" class="form-control" id="event_time" placeholder="Event Time"></input>
          </div>
          <div>
            <input type="submit" class="btn btn-info bg-primary" value="Add Event"></input>
          </div>
        </form>  
    </div>
    )
  }
}



// React-Bootstrap, Modal: https://react-bootstrap.netlify.com/components/modal/#modals
function About() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  return ( // Using the "Fragment Shortcut", '<>..</>' // See: https://reactjs.org/docs/fragments.html
    <> 
      <Button variant="primary" block onClick={handleShow} title="About"> 
        About...
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            <img src={logo} className="App-logo" alt="logo" />About...
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="about-container">
            <div>
              <b>Technologies:</b><br/>
              MERN stack<br/>
              2020 Winter Full Stack Web <a href="pdx.edu" target="_brank">@pdx.edu</a>
            </div>
            <div>
              <b>Developed by:</b><br/>
              Brandon<br/>
              Mirko<br/>
              <a href="https://tamo3.github.io/" rel="noopener noreferrer" target="_blank">Tamotsu</a><br/>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}


export { Menu };
