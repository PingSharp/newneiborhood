import React, { Component } from 'react';
import './App.css';
import Map from './Map';


const mapHeight = window.innerHeight;
class App extends Component {
  showMenu(){
    let list = document.querySelector(".ListContainer");
    if(list.classList.contains("hide")){
      list.classList.remove("hide");
      list.classList.add("show")
    }
    else{
      list.classList.remove("show");
      list.classList.add("hide");
    }
  }
  render() {
    return (
      <div className="App" style={{ height: mapHeight }} >
      <button id='menuItem' onClick={this.showMenu}>menu</button>
        <Map/>
      </div>
    );
  }
}

export default App;
