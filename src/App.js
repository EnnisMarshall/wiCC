import React, { Component } from 'react';

import './App.css';

import ControlPanel from "./components/ControlPanel"
import LoginScreen from "./components/LoginScreen"
import SelectLayout from "./components/SelectLayout"

//import TextField from "./components/TextField"
// class Button extends React.Component {
    
class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      
      loggedIn: false,
      access: "", //"7272794e183736c5a14dce7ebd8ace2fb6fe5e56"
      layout: "" //"2d0028000b47353235303037"
      
  };
    
  }
  
  controlLayout(layout) {
  	this.setState({layout:layout})
    console.log("App.controlLayout() deviceID=", this.state.layout)


  }
  
  logOut() {
  	this.setState({loggedIn:false})
  }
  
  exitLayout(){
   this.controlLayout("")
  }

    
  render() {
    console.log("App.render() deviceID=", this.state.layout)
    console.log("App.render() accessToken=", this.state.access)


    if(!this.state.loggedIn){
      return <LoginScreen app={this} access={this.state.access}/> 
    } else if (this.state.layout === "") {
    	return <div>
              <SelectLayout access={this.state.access} controlLayout={this.controlLayout.bind(this)} logOut={this.logOut.bind(this)}/>
             </div> 
    } else {
      return <ControlPanel access={this.state.access} layout={this.state.layout} exit={this.exitLayout.bind(this)}/>
    }
  }    

}

export default App;

