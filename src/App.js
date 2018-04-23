import React, { Component } from 'react';

import './App.css';

import ControlPanel from "./components/ControlPanel"
import LoginScreen from "./components/LoginScreen"

//import TextField from "./components/TextField"
// class Button extends React.Component {
    
class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      
      loggedIn: false,
      access: "" //"7272794e183736c5a14dce7ebd8ace2fb6fe5e56"
      
  };
    
    //this.sendDcc("7","16");
    //setTimeout ( (() => this.sendDcc("7","0")), 1000)
    
  }

    

  render() {
     
    if(this.state.loggedIn === false){
      return <LoginScreen app={this} access={this.state.access}/> 
    } else {
      return <ControlPanel access={this.state.access} />
    }
  }    

}

export default App;

