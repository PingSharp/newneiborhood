import React, { Component } from 'react';
import ListView from './ListView';

/* global google */
const locationArray = [{ id: 1, title: 'Esslinger Burg(castle)', location: { lat: 48.744706, lng: 9.309553 }, category: 'Tourist Attraction' },
{ id: 2, title: "L'Osteria Esslingen(Italian restaurant)", location: { lat: 48.741794, lng: 9.3052 }, category: 'restaurant' },
{ id: 3, title: 'Altes Rathaus(town hall)', location: { lat: 48.742496, lng: 9.307749 }, category: 'Tourist Attraction' },
{ id: 4, title: 'Pizzeria La Gondola(Italian restaurant)', location: { lat: 48.740956, lng: 9.305065 }, category: 'restaurant' },
{ id: 5, title: 'Maille Park', location: { lat: 48.739811, lng: 9.30664 }, category: 'park' },
{ id: 6, title: 'Weinerlebnispfad(Wine trail)', location: { lat: 48.744452, lng: 9.29973 }, category: 'Tourist Attraction' },
{ id: 7, title: 'Torbogen Durchgang', location: { lat: 48.74174, lng: 9.306581 }, category: 'Tourist Attraction' },
{ id: 8, title: 'rewe', location: { lat: 48.740515, lng: 9.30052 }, category: 'supermarket' }];
class Map extends Component {
  // initialize  all states and functions of Map component
  constructor(props) {
    super(props);
    this.changeShowingArea = this.changeShowingArea.bind(this);
    this.showInfoWindowForList = this.showInfoWindowForList.bind(this);
    this.state = {
      map: {},
      locations: locationArray,
      showingLocations: locationArray,
      places: [],
      showingPlaces: [],
      infoWindow: {}
    }
  }
  // initialize google Maps api service as promise;
  getGoogleMaps() {
    // If we haven't already defined the promise, define it
    if (!this.googleMapsPromise) {
      this.googleMapsPromise = new Promise((resolve) => {
        // Add a global handler for when the API finishes loading
        window.resolveGoogleMapsPromise = () => {
          // Resolve the promise
          resolve(google);
          // Tidy up
          delete window.resolveGoogleMapsPromise;
        };
        // Load the Google Maps API
        const script = document.createElement("script");
        const API = 'AIzaSyAR10K9CLaR4od1WOlpmUhpl4d7NnK9bEY';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${API}&callback=resolveGoogleMapsPromise&libraries=geometry,places`;
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
      });
    }

    // Return a promise for the Google Maps API
    return this.googleMapsPromise;
  }
  // Start Google Maps API loading since we know we'll soon need it
  componentWillMount() {
    this.getGoogleMaps();
  }
  /*  According to the selected option of the dropdown list 
   change the showing markers. */
  changeShowingArea() {
    const filteroption = document.getElementById('search');
    const optionIndex = filteroption.selectedIndex;
    let selecteditems = document.querySelectorAll("[aria-selected*='true']");
    selecteditems.forEach(a => a.removeAttribute('aria-selected', 'true'));
    filteroption[optionIndex].setAttribute("aria-selected", "true");
    let newLocations = this.state.showingLocations;
    let staticLocations = this.state.locations;
    let staticMarkers = this.state.places;
    let newMarkers = this.state.showingPlaces;
    // Get the option that the user selected.
    var address = document.getElementById('search').value;
    if (address === 'All') {
      newLocations = staticLocations;
      newMarkers = staticMarkers;
      newMarkers.forEach((marker) => marker.setMap(this.state.map));
    }
    else {
      newLocations = staticLocations.filter((location) => location.category === address);
      let titles = newLocations.map((location) => location.title);
      newMarkers = staticMarkers.filter((marker) => titles.includes(marker.title));
      let hideMarkers = staticMarkers.filter((marker) => !titles.includes(marker.title));
      hideMarkers.forEach((marker) => marker.setMap(null));
      newMarkers.forEach((marker) => marker.setMap(this.state.map));
    }
    this.setState({
      showingLocations: newLocations,
      showingPlaces: newMarkers
    }
    )
  }
  /*  when a marker or a list item is geclicked, this function will be used to 
   get the infos about this place and show the infos */
  showInfoWindowForList(text) {
    let Content;
    let locationForBing = this.state.locations.filter(location => location.title === text);
    let key = "AkzxNMZFyu0LMgnncgIFLqvXATG_XX_L0b9-5UHkXCl5xfZmw4hfbo0Ra6-ostb6";
    let url = `http://dev.virtualearth.net/REST/v1/Locations/${locationForBing[0].location.lat},${locationForBing[0].location.lng}?key=${key}`;
    let marker = this.state.places.filter(place => place.title === text);
    marker[0].setAnimation(google.maps.Animation.BOUNCE);
    let infoWindow = this.state.infoWindow;
    let map = this.state.map;
    if (infoWindow.marker !== marker[0]) {
      infoWindow.marker = marker[0];
      infoWindow.setContent('');
      infoWindow.open(map, marker[0]);
      /*  Make sure the marker property and the animation of the marker
       is cleared if the infowindow is closed. */
      this.state.infoWindow.addListener('closeclick', function () {
        infoWindow.marker = null;
        marker[0].setAnimation(null);
      });
      this.state.infoWindow.addListener('content_changed', function () {
        infoWindow.marker = null;
        marker[0].setAnimation(null);
      })
      var streetViewService = new google.maps.StreetViewService();
      var radius = 50;
      function getStreetView(data, status) {
        /*  In case the status is OK, which means the pano was found, compute the
       position of the streetview image, then calculate the heading, then get a
       panorama from that and set the options */
        if (status === google.maps.StreetViewStatus.OK) {
          var nearStreetViewLocation = data.location.latLng;
          var heading = google.maps.geometry.spherical.computeHeading(
            nearStreetViewLocation, marker[0].position);
          Content = '<div  tabIndex="0">' + marker[0].title + '</div><div id="pano"></div>';
          // get the infomations about the place with Bing Maps REST Services(for example: address)
          fetch(url).then(
            (resp) => resp.json()
          ).then(function (data) {
            let result = data.resourceSets[0].resources[0].address.formattedAddress;
            infoWindow.setContent(Content + '<div tabIndex="0">' + result + '</div>');
            var panoramaOptions = {
              position: nearStreetViewLocation,
              pov: {
                heading: heading,
                pitch: 30
              }
            };
            var panorama = new google.maps.StreetViewPanorama(
              document.getElementById('pano'), panoramaOptions);
          }).catch((error) => {
            infoWindow.setContent(Content + '<div tabIndex="0">' + error.responseText + '</div>');
            var panoramaOptions = {
              position: nearStreetViewLocation,
              pov: {
                heading: heading,
                pitch: 30
              }
            };
            var panorama = new google.maps.StreetViewPanorama(
              document.getElementById('pano'), panoramaOptions);
          });
        } else {
          fetch(url).then(
            (resp) => resp.json()
          ).then(function (data) {
            let result = data.resourceSets[0].resources[0].address.formattedAddress;
            infoWindow.setContent('<div  tabIndex="0">' + marker[0].title + '</div>' + '<div tabIndex="0">' + result + '</div>');
          }).catch(
            (error) => {
              infoWindow.setContent('<div  tabIndex="0">' + marker[0].title + '</div>' + '<div  tabIndex="0">' + error.responseText + '</div>');
            }
          )
        }
      }
      // Use streetview service to get the closest streetview image within
      // 50 meters of the markers position
      streetViewService.getPanoramaByLocation(marker[0].position, radius, getStreetView);
      // Open the infowindow on the correct marker.
      infoWindow.open(map, marker[0]);
    }
  }
  componentDidMount() {
    // Once the Google Maps API has finished loading, initialize the map
    this.getGoogleMaps().then((google) => {
      const Esslinen = { lat: 48.743343, lng: 9.320112 };
      let bounds = new google.maps.LatLngBounds();
      let placesArray = [];
      let map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: Esslinen
      });
      this.setState({
        map: map
      })
      // initialize the markers
      this.state.locations.forEach(place => {
        let marker = new google.maps.Marker({
          position: place.location,
          map: this.state.map,
          title: place.title,
          animation: google.maps.Animation.DROP
        })
        let showInfoWindow = this.showInfoWindowForList;
        marker.addListener('click', function () {
          showInfoWindow(this.title);
        });
        placesArray.push(marker);
        this.setState({
          places: placesArray,
          showingPlaces: placesArray
        })
        bounds.extend(marker.position);
      })
      // initialize the infowindow;
      let InfoWindows = new google.maps.InfoWindow();
      this.setState({
        infoWindow: InfoWindows
      })
      map.fitBounds(bounds);
    }).catch((error) => { alert(error.responseText); });
  }
  render() {
    return (
      <div className="mapContainer">
        <ListView findArea={this.changeShowingArea} locations={this.state.showingLocations}
          showInfoWindow={this.showInfoWindowForList} />
        <div id="map" role="application">
        </div>
      </div>
    )
  }
}

export default Map;