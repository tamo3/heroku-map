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
      selectedPlace: {}
    };
  }
  onMarkerClick(props, marker, e) {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });
  }
  render() {
    if (!this.props.google) {
      return <div>Loading...</div>;
    }

    // const google = this.props.google;

    return (
      <div
        style={{
          position: "relative",
          height: "calc(100vh - 190px)"
        }}
      >
        <Map 
          style={{}} google={this.props.google} zoom={14}
          initialCenter={{
            lat: 45.509871,
            lng:  -122.680712
          }}>
          {/* <Marker
            onClick={this.onMarkerClick}
            // icon={{ // custom icon here!
            //   url: "/img/icon.svg",
            //   anchor: new google.maps.Point(32, 32),
            //   scaledSize: new google.maps.Size(64, 64)
            // }}
            name={"Current location"}
          /> */}
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
