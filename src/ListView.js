import React, { Component } from 'react';
import PropTypes from 'prop-types';

const mapHeight = window.innerHeight;
const ListView = ({
    findArea,
    locations,
    showInfoWindow
}) => {
    return (
        <div className="ListContainer hide" style={{ height: mapHeight }}>
            <h1 tabIndex="0" role="heading">Esslingen Location</h1>
            <select tabIndex="0" role="menu" id="search" defaultValue={'All'} onChange={findArea}>
                <option role="menuitem" value='All' aria-selected='true' >All</option>
                <option role="menuitem" value='Tourist Attraction'>Tourist Attraction</option>
                <option role="menuitem" value='restaurant'>restaurant</option>
                <option role="menuitem" value='park'>Park</option>
                <option role="menuitem" value='supermarket'>supermarket</option>
            </select>
            <ul className="List">
                {locations.map((location) => {
                    return <li tabIndex='0' role="link" className="ListItem" key={location.id}><a onClick={(event) => { showInfoWindow(event.target.text) }}>{location.title}</a></li>
                })}
            </ul>
        </div>
    )
}
ListView.PropTypes = {
    findArea: PropTypes.func,
    locations: PropTypes.array.isRequired,
    showInfoWindow: PropTypes.func
}


export default ListView;