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
      locations : [{id:1,title: 'Esslinger Burg(castle)',location: {lat: 48.744706, lng: 9.309553 },category:'Tourist Attraction'},
      {id:2,title: "L'Osteria Esslingen(Italian restaurant)",location: {lat: 48.741794, lng: 9.3052},category:'restaurant'},
      {id:3,title: 'Altes Rathaus(town hall)',location: { lat: 48.742496,lng: 9.307749},category:'Tourist Attraction'},
      {id:4,title: 'Pizzeria La Gondola(Italian restaurant)', location: {lat: 48.740956,lng:9.305065},category:'restaurant'},
      {id:5,title: 'Maille Park',location: { lat: 48.739811,lng: 9.30664},category:'park'},
      {id:6,title: 'Weinerlebnispfad(Wine trail)',location: {lat: 48.744452, lng: 9.29973},category:'Tourist Attraction'},
      {id:7,title: 'Torbogen Durchgang',location: {lat: 48.74174, lng: 9.306581},category:'Tourist Attraction'},
      {id:8,title: 'rewe',location: {lat:  48.740515, lng: 9.30052},category:'supermarket'}],
      showingLocations : [{id:1,title: 'Esslinger Burg(castle)',location: {lat: 48.744706, lng: 9.309553 },category:'Tourist Attraction'},
      {id:2,title: "L'Osteria Esslingen(Italian restaurant)",location: {lat: 48.741794, lng: 9.3052},category:'restaurant'},
      {id:3,title: 'Altes Rathaus(town hall)',location: { lat: 48.742496,lng: 9.307749},category:'Tourist Attraction'},
      {id:4,title: 'Pizzeria La Gondola(Italian restaurant)', location: {lat: 48.740956,lng:9.305065},category:'restaurant'},
      {id:5,title: 'Maille Park',location: { lat: 48.739811,lng: 9.30664},category:'park'},
      {id:6,title: 'Weinerlebnispfad(Wine trail)',location: {lat: 48.744452, lng: 9.29973},category:'Tourist Attraction'},
      {id:7,title: 'Torbogen Durchgang',location: {lat: 48.74174, lng: 9.306581},category:'Tourist Attraction'},
      {id:8,title: 'rewe',location: {lat:  48.740515, lng: 9.30052},category:'supermarket'} ],
     places: [],
     showingPlaces: [],
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
        let newLocations = this.state.showingLocations;
        let staticLocations = this.state.locations;
        let staticMarkers = this.state.places;
        let newMarkers = this.state.showingPlaces;
        // Get the address or place that the user selected.
        var address = document.getElementById('search').value;
        if(address==='All'){
          newLocations = staticLocations;
          newMarkers = staticMarkers;
          newMarkers.forEach((marker)=>marker.setMap(this.state.map));
        }
        else{
          newLocations = staticLocations.filter((location)=>location.category===address);
          let titles = newLocations.map((location)=>location.title);
          newMarkers = staticMarkers.filter((marker)=>titles.includes(marker.title));
          let hideMarkers = staticMarkers.filter((marker)=>!titles.includes(marker.title));
          hideMarkers.forEach((marker)=>marker.setMap(null));
          newMarkers.forEach((marker)=>marker.setMap(this.state.map));
        }
          
        
        this.setState({
          showingLocations: newLocations,
          showingPlaces: newMarkers
        }
        )
      }
    
     showInfoWindowForList(text){
      let service = new google.maps.places.PlacesService(this.state.map);
      let place;
      let Content;
        let marker =  this.state.places.filter(place=>place.title === text);
        let query = marker[0].title;
        let Esslinen = {lat:  marker[0].position.lat(), lng: marker[0].position.lng()};
        let request = {
          location: Esslinen,
          query: query,
          radius: '1000'
        }
       
        marker[0].setAnimation(google.maps.Animation.BOUNCE);
        let infoWindow = this.state.infoWindow;
        let map = this.state.map;
        if (infoWindow.marker !== marker[0]) {
          infoWindow.marker = marker[0];
          infoWindow.setContent('');
          infoWindow.open(map,marker[0]);
          // Make sure the marker property is cleared if the infowindow is closed.
          this.state.infoWindow.addListener('closeclick',function(){
            infoWindow.marker = null;
            marker[0].setAnimation(null);
          });
          this.state.infoWindow.addListener('content_changed',function(){
            infoWindow.marker = null;
            marker[0].setAnimation(null);
          })
          var streetViewService = new google.maps.StreetViewService();
          
          var radius = 50;
          
          // In case the status is OK, which means the pano was found, compute the
          // position of the streetview image, then calculate the heading, then get a
          // panorama from that and set the options
          function getStreetView(data, status) {
            if (status === google.maps.StreetViewStatus.OK) {
              service.textSearch(request,getInfos);
              var nearStreetViewLocation = data.location.latLng;
              var heading = google.maps.geometry.spherical.computeHeading(
                nearStreetViewLocation, marker[0].position);
              Content = '<div>' + marker[0].title + '</div><div id="pano"></div>';
                
            
                function getInfos(results,status){
                  if (status == google.maps.places.PlacesServiceStatus.OK) {             
                    place = results[0]; 
                    infoWindow.setContent(Content+'<div>'+place.formatted_address+'</div>');
                    
                }
                else{
                  infoWindow.setContent(Content) ;
                 
                } 
                var panoramaOptions = {
                  position: nearStreetViewLocation,
                  pov: {
                    heading: heading,
                    pitch: 30
                  }
                };
                var panorama = new google.maps.StreetViewPanorama(
                  document.getElementById('pano'), panoramaOptions);               
              }
             
               
            } else {  
              service.textSearch(request,getInfos);
              function getInfos(results,status){
                if (status == google.maps.places.PlacesServiceStatus.OK) {             
                  place = results[0]; 
                  infoWindow.setContent('<div>' + marker[0].title + '</div>'+'<div>'+place.formatted_address+'</div>');
                  
              }
              else{
                infoWindow.setContent('<div>' + marker[0].title + '</div>'+'<div>Sorry!We couldnt find anything about this place</div>') ;
               
              }             
            }                                    
          
          }
          
        }

        // Use streetview service to get the closest streetview image within
          // 50 meters of the markers position
          streetViewService.getPanoramaByLocation(marker[0].position, radius, getStreetView);
          // Open the infowindow on the correct marker.
          infoWindow.open(map, marker[0]);
       }}
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
              places: placesArray,
              showingPlaces: placesArray
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
        }).catch((error)=>{alert(error.responseText);});
      }
    render(){
        return(
            <div className="mapContainer">
            <ListView findArea={this.changeShowingArea} locations = {this.state.showingLocations} 
            map={this.state.map} places={this.state.showingPlaces} infoWindow = {this.state.infoWindow}
            showInfoWindow={this.showInfoWindowForList} />
            <div id="map">
            </div>
            </div>
        )
    }
}

export default Map;