import React, { Component } from 'react';

const mapHeight = window.innerHeight;
class ListView extends Component {
    render(){
        return(
            <div  className="ListContainer hide" style={{height: mapHeight}}>
                <h1 tabIndex="0"  role="heading">Esslingen Location</h1>
                <select tabIndex="0"  role="menu" id="search" defaultValue={'select'} onChange={this.props.findArea}>
                 <option  value='select' disabled>select...</option>
                  <option role="menuitem" value='All'>All</option>
                  <option role="menuitem" value='Tourist Attraction'>Tourist Attraction</option> 
                  <option role="menuitem" value='restaurant'>restaurant</option>
                  <option role="menuitem" value='park'>Park</option> 
                  <option role="menuitem" value='supermarket'>supermarket</option>
                </select>
                <ul   className="List">
                    {this.props.locations.map((location)=>{
                        return <li role="link" tabIndex="0" className="ListItem" key={location.id}><a onClick={(event)=>{this.props.showInfoWindow(event.target.text)}}>{location.title}</a></li>
                    })}
                </ul>
            </div>
        )
    }
    
}

export default ListView;