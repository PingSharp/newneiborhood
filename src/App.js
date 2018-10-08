import React, { Component } from 'react';
import './App.css';
import Map from './Map';


const mapHeight = window.innerHeight;

class App extends Component {
  /* This function is responsible for the show and hide the menu 
  when the screen size is smaller than 640px. */
  showMenu(target){
    let list = document.querySelector(".ListContainer");
    if(list.classList.contains("hide")){
      list.classList.remove("hide");
      list.classList.add("show");
      target.setAttribute("aria-pressed","true");
    }
    else{
      list.classList.remove("show");
      list.classList.add("hide");
      target.setAttribute("aria-pressed","false");
    }
  }
  render() {
    return (
      <div className="App" style={{ height: mapHeight }} >
      <button id='menuItem' aria-pressed="false" onClick={(event)=>this.showMenu(event.target)}>menu</button>
        <Map/>
      </div>
    );
  }
}

export default App;
