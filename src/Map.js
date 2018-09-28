import React, { Component } from 'react';

 /* global google */ 
class Map extends Component{
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
            script.src = `https://maps.googleapis.com/maps/api/js?key=${API}&callback=resolveGoogleMapsPromise`;
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
    
      componentDidMount() {
        // Once the Google Maps API has finished loading, initialize the map
        this.getGoogleMaps().then((google) => {
          const Esslinen = {lat:  48.743343, lng: 9.320112};
          const map = new google.maps.Map(document.getElementById('map'), {
            zoom: 4,
            center: Esslinen
          });
          const marker = new google.maps.Marker({
            position: Esslinen,
            map: map
          });
        });
      }
    render(){
        return(
            <div id="map"></div>
        )
    }
}

export default Map;