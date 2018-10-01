import React, { Component } from 'react';
import './App.css';
import Map from './Map';


const mapHeight = window.innerHeight;
class App extends Component {
  render() {
    return (
      <div className="App" style={{ height: mapHeight }} >
        <Map/>
      </div>
    );
  }
}

export default App;
