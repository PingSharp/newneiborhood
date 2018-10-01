import React, { Component } from 'react';
import ListView from './ListView';

 /* global google */ 

class Map extends Component{
  constructor(props){
    super(props);
    this.changeShowingArea = this.changeShowingArea.bind(this);
    this.showInfoWindowForList = this.showInfoWindowForList.bind(this);
    this.state = {
      map: {},
      locations : [{id:1,title: 'Esslinger Burg(castle)',location: {lat: 48.744706, lng: 9.309553 }},
      {id:2,title: "L'Osteria Esslingen(Italian restaurant)",location: {lat: 48.741794, lng: 9.3052}},
      {id:3,title: 'Altes Rathaus(town hall)',location: { lat: 48.742496,lng: 9.307749}},
      {id:4,title: 'Pizzeria La Gondola(Italian restaurant)', location: {lat: 48.740956,lng:9.305065}},
      {id:5,title: 'Maille Park',location: { lat: 48.739811,lng: 9.30664}},
      {id:6,title: 'Weinerlebnispfad(Wine trail)',location: {lat: 48.744452, lng: 9.29973}}],
     places: [],
     infoWindow: {}
    }
  }

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
    
      componentWillMount() {
        // Start Google Maps API loading since we know we'll soon need it
        this.getGoogleMaps();
      }
      changeShowingArea() {
        let newMap = this.state.map;
        // Initialize the geocoder.
        var geocoder = new google.maps.Geocoder();
        // Get the address or place that the user entered.
        var address = document.getElementById('search').value;
        // Make sure the address isn't blank.
        if (address === '') {
          window.alert('You must enter an area, or address.');
        } else {
          // Geocode the address/area entered to get the center. Then, center the map
          // on it and zoom in
          geocoder.geocode(
            { address: address,
              componentRestrictions: {locality: 'New York'}
            }, function(results, status) {
              if (status === google.maps.GeocoderStatus.OK) {
                newMap = newMap.setCenter(results[0].geometry.location);                             
              } else {
                window.alert('We could not find that location - try entering a more' +
                    ' specific place.');
              }
            });         
          }
        this.setState({
          map: newMap
        }
        )
      }
       showInfoWindowForList(text){
         debugger;
        let marker =  this.state.places.filter(place=>place.title === text);
        let infoWindow = this.state.infoWindow;
        let map = this.state.map;
        if (infoWindow.marker !== marker[0]) {
          infoWindow.marker = marker[0];
          infoWindow.setContent('');
          infoWindow.open(map,marker[0]);
          // Make sure the marker property is cleared if the infowindow is closed.
          this.state.infoWindow.addListener('closeclick',function(){
            infoWindow.marker = null;
          });
          var streetViewService = new google.maps.StreetViewService();
          var radius = 50;
          // In case the status is OK, which means the pano was found, compute the
          // position of the streetview image, then calculate the heading, then get a
          // panorama from that and set the options
          function getStreetView(data, status) {
            if (status === google.maps.StreetViewStatus.OK) {
              var nearStreetViewLocation = data.location.latLng;
              var heading = google.maps.geometry.spherical.computeHeading(
                nearStreetViewLocation, marker[0].position);
                infoWindow.setContent('<div>' + marker[0].title + '</div><div id="pano"></div>');
                var panoramaOptions = {
                  position: nearStreetViewLocation,
                  pov: {
                    heading: heading,
                    pitch: 30
                  }
                };
              var panorama = new google.maps.StreetViewPanorama(
                document.getElementById('pano'), panoramaOptions);
            } else {
              infoWindow.setContent('<div>' + marker[0].title + '</div>' +
                '<div>No Street View Found</div>');
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
          const Esslinen = {lat:  48.743343, lng: 9.320112};
          let bounds = new google.maps.LatLngBounds();
          let placesArray = [];
          let map = new google.maps.Map(document.getElementById('map'), {
            zoom: 15,
            center: Esslinen
          });
          this.setState({
            map: map
          })
          this.state.locations.forEach(place=>{
            let marker = new google.maps.Marker({
              position: place.location,
              map: this.state.map,
              title: place.title,
              animation: google.maps.Animation.DROP
            })
            let showInfoWindow = this.showInfoWindowForList;
            marker.addListener('click',function(){
             showInfoWindow(this.title);
            });
          placesArray.push(marker);
            this.setState({
              places: placesArray
            })
            bounds.extend(marker.position);
          })
          let InfoWindows = new google.maps.InfoWindow();
          this.setState({
            infoWindow: InfoWindows
          })
          // let newMap = this.state.map;
          map.fitBounds(bounds);
         /*  this.setState({
            map: newMap
          }) */
        });
      }
    render(){
        return(
            <div className="mapContainer">
            <ListView findArea={this.changeShowingArea} locations = {this.state.locations} 
            map={this.state.map} places={this.state.places} infoWindow = {this.state.infoWindow}
            showInfoWindow={this.showInfoWindowForList} />
            <div id="map">
            </div>
            </div>
        )
    }
}

export default Map;