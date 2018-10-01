import React, { Component } from 'react';

const mapHeight = window.innerHeight;
class ListView extends Component {
    decideMarker(target){
        let text = target.text;
        let marker =  this.props.places.filter(place=>place.title === text);
        this.props.showInfoWindow(marker,this.props.infoWindow,this.props.map);
    }
    render(){
        return(
            <div className="ListContainer" style={{height: mapHeight}}>
                <h1>Esslingen Location</h1>
                <input id="search" type="text" placeholder="Station location"></input>
                <input id="searchButton" type="button" value="Filter" onClick={this.props.findArea}></input>
                <ul className="List">
                    {this.props.locations.map((location)=>{
                        return <li className="ListItem" key={location.id}><a onClick={(event)=>{this.props.showInfoWindow(event.target.text)}}>{location.title}</a></li>
                    })}
                </ul>
            </div>
        )
    }
    
}

export default ListView;