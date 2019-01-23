/* global google */
import React, { Component } from "react";
import GoogleMapReact from "google-map-react";
import LineTo from "react-lineto";

const AnyReactComponent = ({ text }) => <div>{text}</div>;

class SimpleMap extends Component {
  constructor(props) {
    super(props);

    this.map = null;
    this.calcGap = 15;
    this.iconBase = "https://maps.google.com/mapfiles/kml/shapes/";
    this.icons = {
      parking: {
        icon: this.iconBase + "parking_lot_maps.png"
      },
      info: {
        icon: this.iconBase + "info-i_maps.png"
      }
    };
    this.f = this.f.bind(this);
    this.processData = this.processData.bind(this);
  }

  static defaultProps = {
    center: {
      lat: 37.7749,
      lng: -122.4194
    },
    zoom: 11
  };

  async f(id) {
    return fetch("/api/routes/fetchone", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id: id })
    })
      .then(res => res.json())
      .then(data => {
        this.processData(data);
      });
  }

  getGoogleMaps() {
    // const google = window.google;
    // If we haven't already defined the promise, define it
    if (!this.googleMapsPromise) {
      this.googleMapsPromise = new Promise(resolve => {
        // Add a global handler for when the API finishes loading
        window.resolveGoogleMapsPromise = () => {
          // Resolve the promise
          resolve(google);

          // Tidy up
          delete window.resolveGoogleMapsPromise;
        };

        // Load the Google Maps API
        const script = document.createElement("script");
        const API = "AIzaSyAOau1ruJXVvJTX87OltfOHUO0n4u4sNfA";
        script.src = `https://maps.googleapis.com/maps/api/js?key=${API}&callback=resolveGoogleMapsPromise`;
        script.async = true;
        document.body.appendChild(script);
      });
    }

    // Return a promise for the Google Maps API
    return this.googleMapsPromise;
  }

  componentWillMount() {
    // Start Google Maps API loading since we know we'll soon need it
    this.getGoogleMaps();
  }

  componentDidMount() {
    // Once the Google Maps API has finished loading, initialize the map
    this.getGoogleMaps().then(google => {
      const sf = { lat: 37.7749, lng: -122.4194 };
      const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: sf
      });
      this.map = map;
      this.drawLines();
    });
  }

  drawLines = () => {
    fetch("/api/routes/fetchids", {
      method: "POST"
    })
      .then(res => res.json())
      .then(ids => ids.map(async id => await this.f(id)));
  };

  getColor = speed => {
    // let letters = "0123456789ABCDEF";
    // let color = "#";

    // for (let i = 0; i < 6; i++) {
    //   color += letters[Math.floor(Math.random() * 16)];
    // }
    function componentToHex(c) {
      var hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    }

    function rgbToHex(r, g, b) {
      return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }
    let percentage = speed / 45.0;
    if (percentage > 1) percentage = 1;
    return rgbToHex(
      Math.floor(255 - 255 * percentage),
      Math.floor(255 * percentage),
      0
    );
  };

  processData = data => {
    let map = this.map;
    let icons = this.icons;
    let points = data.data;
    let calcGap = this.calcGap;
    // let startPoint = {
    //     lat: points[0].coordinates[0],
    //     lng: points[0].coordinates[1]
    //   },
    //   endPoint = {
    //     lat: points[points.length - 1].coordinates[0],
    //     lng: points[points.length - 1].coordinates[1]
    //   };
    let coords = points.map(point => ({
      lat: point.coordinates[0],
      lng: point.coordinates[1]
    }));
    let speeds = points.map(point => point.speed);
    for (let i = 0; i < coords.length - calcGap; i += calcGap - 1) {
      let path = coords.slice(i, i + calcGap);
      let sumSpeed = 0;
      let lastSpeed = 0;
      var infoWindow = new google.maps.InfoWindow();
      for (let j = i; j < i + calcGap; j++) {
        if (j >= speeds.legnth) {
          sumSpeed += lastSpeed;
        } else {
          sumSpeed += speeds[j];
          lastSpeed = speeds[j];
        }
      }
      let avgSpeed = sumSpeed / calcGap;
      infoWindow.setContent(
        "Current average speed: " + avgSpeed.toFixed(2) + " miles per hour."
      );
      let color = this.getColor(avgSpeed);
      let carRoute = new google.maps.Polyline({
        path: path,
        geodesic: true,
        strokeColor: color,
        strokeOpacity: 1.0 * (avgSpeed / 45),
        strokeWeight: 3
      });
      carRoute.addListener("click", event => {
        infoWindow.setPosition(event.latLng);
        infoWindow.open(map);
      });
      carRoute.setMap(map);
    }
    // let carRoute = new google.maps.Polyline({
    //   path: coords,
    //   geodesic: true,
    //   strokeColor: this.getColor(),
    //   strokeOpacity: 1.0,
    //   strokeWeight: 2
    // });
    // carRoute.setMap(map);

    // var features = [
    //   {
    //     position: new google.maps.LatLng(startPoint.lat, startPoint.lng),
    //     type: "info"
    //   },
    //   {
    //     position: new google.maps.LatLng(endPoint.lat, endPoint.lng),
    //     type: "parking"
    //   }
    // ];
    // Create markers.
    // features.forEach(function(feature) {
    //   var marker = new google.maps.Marker({
    //     position: feature.position,
    //     icon: icons[feature.type].icon,
    //     map: map
    //   });
    // });
  };

  render() {
    return (
      // Important! Always set the container height explicitly
      <div>
        <div id="map" style={{ width: "100%", height: "100vh" }} />
      </div>
    );
  }
}

export default SimpleMap;
