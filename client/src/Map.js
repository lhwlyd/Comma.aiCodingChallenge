import React, { Component } from "react";
import GoogleMapReact from "google-map-react";

const AnyReactComponent = ({ text }) => <div>{text}</div>;

class SimpleMap extends Component {
  static defaultProps = {
    center: {
      lat: 59.95,
      lng: 30.33
    },
    zoom: 11
  };

  componentDidMount() {
    fetch("/api/routes/fetchfirst", {
      method: "POST"
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
      });
  }

  render() {
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: "100vh", width: "100%" }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyBNu2cvBTH58bT_cO86kF18H1ddmOuxO6M" }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
        >
          <AnyReactComponent
            lat={59.955413}
            lng={30.337844}
            text="Kreyser Avrora"
          />
        </GoogleMapReact>
      </div>
    );
  }
}

export default SimpleMap;
