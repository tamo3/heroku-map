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
      numChecked: 0,        // Keep track of the number of checked checkboxes.
      eventList: null,      // Keep the latest event list from API.
      // eventList should at least have these fields:
      //   name: x.title,
      //   loc: {
      //     type: "Point",
      //     coordinates: [x.location[0], x.location[1]]  // [lng, lat]
      //   },
    };
  }
  eventCheckboxStatus = [];  // Keep track of checkbox status, i.e. eventCheckboxStatus[2]==1, then 3rd event is checked.
  isMyList = false; // true = list is from DB (My List), false = list is from API.

  checkboxCheked(i) { // If [i]th checkbox is checked or not.
    if (i < this.eventCheckboxStatus.length && this.eventCheckboxStatus[i])
      return true;
    return false;
  }

  // Add selected events to DB.
  readWriteData() {
    const eventList = this.state.eventList || []; // To deal with empty array.
    if (eventList.length > 0) {
      const list = eventList.filter((x, i) => this.checkboxCheked(i)); // Filter only checked events.
      if (list.length > 0) {
        const evArray = list.map((x, i) => { // Create event array.
          const item = { // JSON object for sending to DB.
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
        if (this.isMyList) {
          this.props.cbDelData(evArray); // Call App.js/callbackDelData().
        }
        else {
          this.props.cbAddData(evArray); // Call App.js/callbackAddData().
        }
      }
    }
  }

  // Clear Markers on MAP.
  clearMarkers() {
    this.setState({ numChecked: 0 });
    const tbl = document.getElementsByClassName("event-list");
    for (let i = 0; i < tbl[0].rows.length; i++)
      tbl[0].rows[i].cells[0].childNodes[0].children[0].checked = false;
    this.props.cbDelMarker(); // Call App.js/callbackDeleteMarkers().
  }

  // Find events through API.
  listEvents() {
    this.clearMarkers();
    this.isMyList = false;
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

  // Get my events from DB then display them to event pane.
  myList() {
    this.isMyList = true;
    this.eventCheckboxStatus = []; // Clear the chekbox status array.
    this.props.cbGetData();  // Call App.js/callbackGetData().

    const locations = this.props.locations || []; // To deal with emptyr array.
    const locList = locations.map(loc => {
      const item = {
        title: loc.title,
        location: {
          lat: loc.lat,
          lng: loc.lng
        }
      };
      return item;
    });
    this.setState({eventList: locList}); // Assign the result array to eventList.
  }

  // How to pass argument to onClick: https://stackoverflow.com/questions/50330124/how-to-pass-checkbox-state-to-onclick-function-in-react
  cbxClicked(event) { // Updated checkbox status array.
    const cbx = event.currentTarget; // console.log(cbx.checked); console.log(cbx.value); 
    this.eventCheckboxStatus[cbx.value] = cbx.checked;

    // Count checked items // https://stackoverflow.com/questions/49380306/javascript-array-counting-sparse-indexed-element
    const n = this.eventCheckboxStatus.reduce((acc,c) => acc + c ? 1 : 0, 0); 
    this.setState({numChecked: n}); // Update number of checked checkboxes.

    // Set/Clear Marker.
    const x = this.state.eventList[cbx.value];
    const evLoc = {
      title: x.title,
      location: {
        lat: x.location[1], lng: x.location[0],
      },
    };
    if (this.isMyList) {
      // todo: what to do? For now, don't do anything. Would be nice if we could change the color of Marker.
    }
    else {
      this.props.cbAddDel(evLoc, cbx.checked); // Call App.js/callbackAddDelMarker().
    }
  }
 
  render() {
    const eventList = this.state.eventList || []; // To deal with emptyr array.
    const str = this.isMyList ? "Delete from My List" : "Add to My List"; // Button string.

    return (
    <div>
        <div >
          <div className="row mb-1 "><button type="button" className="dash-button btn btn-block btn-primary" onClick={() => this.listEvents()} title="Access current events from API">Find Events</button></div>
          <div className="row mb-1 "><button type="button" className="dash-button btn btn-block btn-primary" onClick={() => this.myList()} title="Get events from DB">My List</button></div>
          <div className="row mb-1 "><button type="button" className="dash-button btn btn-block btn-primary" onClick={() => this.clearMarkers()} title="Clear markers from map">Clear Markers</button></div>
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
            <input type="button" disabled={this.state.numChecked===0} onClick={() => this.readWriteData()} id="add" class="btn btn-info bg-primary" value={str}></input>
            {/* <input type="button" onClick={() => addEvent()} id="add" class="btn btn-info bg-primary" value="Add Event"></input> */}
          </div>
        </form>  
    </div>
    )
  }


  // For About dialog.
  togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup
    });
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
              <a href="https://www.linkedin.com/in/mirko-draganic-98822313b/" rel="noopener noreferrer" target="_blank">Mirko</a><br/>
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