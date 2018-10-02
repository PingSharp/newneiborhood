import React, { Component } from 'react';

const mapHeight = window.innerHeight;
class ListView extends Component {
    render(){
        return(
            <div className="ListContainer hide" style={{height: mapHeight}}>
                <h1>Esslingen Location</h1>
                <select id="search" defaultValue={'select'} onChange={this.props.findArea}>
                 <option value='select' disabled>select...</option>
                  <option value='All'>All</option>
                  <option value='Tourist Attraction'>Tourist Attraction</option> 
                  <option value='restaurant'>restaurant</option>
                  <option value='park'>Park</option> 
                  <option value='supermarket'>supermarket</option>
                </select>
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