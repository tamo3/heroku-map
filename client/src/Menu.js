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
// phqEvents.search({within: withinParam})
//   .then(logEventsToConsole)
//   .catch(err => console.error(err));
// function addEvent() {
//   var table = document.getElementById("events_table");
//   var row= document.createElement("tr");
//   console.log(row);
//   var event_title = document.createElement("td");
//   var event_location = document.createElement("td");
//   var event_time = document.createElement("td");
//   event_title.innerHTML = document.getElementById("event_title").value;
//   event_location.innerHTML  = document.getElementById("event_location").value;
//   event_time.innerHTML  = document.getElementById("event_time").value;
//   row.appendChild(event_title);
//   row.appendChild(event_location);
//   row.appendChild(event_time);
//   table.children[0].appendChild(row);
// }

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventList: null,          // Keep the latest event list from API.
      numChecked: 0,
    };
  }
  eventCheckboxStatus = [];  // Keep track of checkbox status, i.e. eventCheckboxStatus[2]==1, then 3rd event is checked.
  checkboxCheked(i) {
    if (i < this.eventCheckboxStatus.length && this.eventCheckboxStatus[i])
      return true;
    return false;
  }
  getData(cbGetData) {
    cbGetData(); // Call App.js/callbackGetData().
  }
  delMarker(cbDelMarker) {
    cbDelMarker(); // Call App.js/callbackDeleteMarkers().
  }
  addData(cbAddData) {
    const eventList = this.state.eventList || []; // To deal with empty array.
    if (eventList.length > 0) {
      const list = eventList.filter((x, i) => this.checkboxCheked(i)); // Filter only checked events.
      if (list.length > 0) {
        const evArray = list.map((x, i) => { // Create event array.
          const item = {
            start: x.start,
            end: x.end,
            name: x.title,
            loc: {
              type: "Point",
              coordinates: [x.location[0], x.location[1]]  // [lng, lat] -- different from Google Map!  Need to swap!
            },
            web: '',
            desc: x.category,
          };
          return item;
        });
        cbAddData(evArray); // Call App.js/callbackAddData().
      }
    }
  }
  listEvents() {
    this.eventCheckboxStatus = []; // Clear the chekbox status array.
    phqEvents.search({within: withinParam})
    .then((ev) => {
      logEventsToConsole(ev);
      console.log(ev.result.results.length);
      console.log(`ID=${ev.result.results[0].id} Title=${ev.result.results[0].title} loc=${ev.result.results[0].location[1]},${ev.result.results[0].location[0]}`);
      this.setState({eventList: ev.result.results}); // Assign the result array to eventList.
    })
    .catch(err => console.error(err));
  }

  // For About dialog.
  togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup
    });
  }

  // How to pass argument to onClick: https://stackoverflow.com/questions/50330124/how-to-pass-checkbox-state-to-onclick-function-in-react
  cbxClicked(event) { // Updated checkbox status array.
    const cbx = event.currentTarget;
    // console.log(cbx.checked); console.log(cbx.value); 
    this.eventCheckboxStatus[cbx.value] = cbx.checked;
    const n = this.eventCheckboxStatus.reduce((acc,c) => acc + c ? 1 : 0, 0); // Count checked items.
    this.setState({numChecked: n});
  }
 
  render() {
    const eventList = this.state.eventList || []; // To deal with emptyr array.
    return (
    <div>
        <div >
          <div className="row mb-1 "><button type="button" className="dash-button btn btn-block btn-primary" onClick={() => this.getData(this.props.cbGetData)} title="Get events from DB">My Events</button></div>
          {/* <div className="row mb-1 "><button type="button" className="dash-button btn btn-block btn-primary" onClick={() => this.addData(this.props.cbAddData)} title="add data to DB">Debug Add Event</button></div> */}
          <div className="row mb-1 "><button type="button" className="dash-button btn btn-block btn-primary" onClick={() => this.listEvents()} title="Access current events from API">Find Events</button></div>
          <div className="row mb-1 "><button type="button" className="dash-button btn btn-block btn-primary" onClick={() => this.delMarker(this.props.cbDelMarker)} title="Clear markers from map">Clear Markers</button></div>
          <div className="row mb-1 "><About /></div>
        </div>
        <br></br>
        <div>
          <table className="table table-bg" id="events_table">
            <thead className="thead-dark">
              <tr>
                <th>Event</th>
                <th>Location</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody className="event-list">
              {eventList.map((x,i) => {
                return (
                <tr>
                  <td><label><input type="checkbox" value={i} onClick={(event)=>this.cbxClicked(event)}></input>{x.title}</label></td>
                  <td>Portland, OR</td>
                  <td>8AM</td>
                </tr>);})
              }
            </tbody>
          </table>
        </div>
        <form>
          <div class="form-group">
            <label className="event-name">Event Name</label>
            <input type="text" class="form-control" name="event_title" id="event_title" aria-describedby="event_title" placeholder="Event Name"></input>
          </div>
          <div className="form-group">
            <label for="event-location">Event Location</label>
            <input type="location" class="form-control" name="event_location" id="event_location" placeholder="Event Location"></input>
          </div>
          <div class="form-group">
            <label className="event-time">Event Time</label>
            <input type="time" class="form-control" name="event_time" id="event_time" placeholder="Event Time"></input>
          </div>
          <div>
            <input type="button" disabled={this.state.numChecked===0} onClick={() => this.addData(this.props.cbAddData)} id="add" class="btn btn-info bg-primary" value="Add Event"></input>
            {/* <input type="button" onClick={() => addEvent()} id="add" class="btn btn-info bg-primary" value="Add Event"></input> */}
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
              Mirko<br/>
              <a href="https://tamo3.github.io/3-music.html" rel="noopener noreferrer" target="_blank">Tamotsu</a><br/>
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