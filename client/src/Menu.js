import React, { Component, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal } from 'react-bootstrap';
import './App.css';
import logo from './logo.svg';


class Menu extends Component {

  checkboxCheked(i) { // If [i]th checkbox is checked or not.
    if (i < this.props.eventCheckboxStatus.length && this.props.eventCheckboxStatus[i])
      return true;
    return false;
  }

  // Add selected events to DB.
  readWriteData() {
    const eventList = this.props.eventList || []; // To deal with empty array.
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
        if (this.props.isMyList) {
          this.props.cbDelData(evArray); // Call App.js/callbackDelData().
        }
        else {
          this.props.cbAddData(evArray); // Call App.js/callbackAddData().
        }
      }
    }
  }


  // How to pass argument to onClick: https://stackoverflow.com/questions/50330124/how-to-pass-checkbox-state-to-onclick-function-in-react
  cbxClicked(event) { // Updated checkbox status array.
    // Set/Clear Marker.
    const cbx = event.currentTarget; // console.log(cbx.checked); console.log(cbx.value);
    const x = this.props.eventList[cbx.value];
    const evLoc = {
      title: x.title,
      location: {
        lat: x.location[1], lng: x.location[0],
      },
      checked: cbx.checked,
      index: cbx.value,
    };
    this.props.cbChkClick(evLoc, this.props.isMyList);
  }

  render() {
    const eventList = this.props.eventList || []; // To deal with emptyr array.
    const str = this.props.isMyList ? "Delete from My List" : "Add to My List"; // Button string.

    return (
    <div>
        <div >
          <div className="row mb-1 "><button type="button" className="dash-button btn btn-block btn-primary" onClick={() => this.props.cbFindEvents()} title="Access current events from API">Find Events</button></div>
          <div className="row mb-1 "><button type="button" className="dash-button btn btn-block btn-primary" onClick={() => this.props.cbGetData()} title="Get events from DB">My List</button></div>
          <div className="row mb-1 "><button type="button" className="dash-button btn btn-block btn-primary" onClick={() => this.props.cbDelMarker()} title="Clear markers from map">Clear Markers</button></div>
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
                  <td><label><input type="checkbox" value={i} onClick={(event)=>this.cbxClicked(event)} checked={!!this.props.eventCheckboxStatus[i]}></input>{x.title}</label></td>
                  <td>Portland, OR</td>
                  <td>8AM</td>
                </tr>);})
              }
            </tbody>
          </table>
        </div>
        <form>
          <div class="addDelButton">
            <input type="button" disabled={this.props.numChecked===0} onClick={() => this.readWriteData()} id="add" class="btn btn-info bg-primary" value={str}></input>
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