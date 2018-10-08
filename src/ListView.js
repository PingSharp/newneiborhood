import React, { Component } from 'react';

const mapHeight = window.innerHeight;
const ListView = ({
    findArea,
    locations,
    showInfoWindow
}) => {
        return(
            <div  className="ListContainer hide" style={{height: mapHeight}}>
                <h1 tabIndex="0"  role="heading">Esslingen Location</h1>
                <select tabIndex="0"  role="menu" id="search" defaultValue={'select'} onChange={findArea}>
                 <option  value='select' disabled>select...</option>
                  <option role="menuitem" value='All'>All</option>
                  <option role="menuitem" value='Tourist Attraction'>Tourist Attraction</option> 
                  <option role="menuitem" value='restaurant'>restaurant</option>
                  <option role="menuitem" value='park'>Park</option> 
                  <option role="menuitem" value='supermarket'>supermarket</option>
                </select>
                <ul   className="List">
                    {locations.map((location)=>{
                        return <li role="link" tabIndex="0" className="ListItem" key={location.id}><a onClick={(event)=>{showInfoWindow(event.target.text)}}>{location.title}</a></li>
                    })}
                </ul>
            </div>
        )
    }
    


export default ListView;