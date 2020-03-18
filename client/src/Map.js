// Reference: https://github.com/fullstackreact/google-maps-react
// https://codesandbox.io/s/rzwrk2854

import React, { Component } from 'react';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from "google-maps-react";

const mapKey = 'AIzaSyBdBb3UJJAFYHU76vXhd_sBoSdvVJk6WaI';

export class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.state = {
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
    };
  }
  onMarkerClick(props, marker, e) {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });
  }

  // Return color object for Marker.
  markerColor(color) {
    color = {
      url: `http://maps.google.com/mapfiles/ms/icons/${color}.png`
    };
    return color;
  }

  // Return Marker icon with different colors based on the state.
  markerIcon(i) {
    if (this.props.eventCheckboxStatus[i] === true)
      return this.markerColor('yellow');  // Selected => yellow.
    if (this.props.isMyList)
      return this.markerColor('blue');    // From my list (DB) => blue.
    else
      return this.markerColor('red');     // From API => red.
  }

  render() {
    if (!this.props.google) {
      return <div>Loading...</div>;
    }

    const marker = this.props.eventList.map((item, i) => <Marker
      name={item.title}
      title={item.title}
      position={{ lat: item.location.lat, lng: item.location.lng }}
      onClick={this.onMarkerClick}
      icon={this.markerIcon(i)}
    />);


    return (
      <div
        style={{
          position: "relative",
          height: "calc(100vh - 80px)"
        }}
      >
        <Map
          style={{}} google={this.props.google} zoom={14}
          initialCenter={{
            lat: 45.509871,
            lng: -122.680712
          }}>
          {marker}

          <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showingInfoWindow}
          >
            <div>
              <h1>{this.state.selectedPlace.name}</h1>
            </div>
          </InfoWindow>
        </Map>
      </div>
    );
  }
}


export default GoogleApiWrapper({
  apiKey: mapKey,
  v: "3.30"
})(MapContainer);