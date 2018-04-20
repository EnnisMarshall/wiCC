import React, { Component } from 'react';

import './App.css';

import RadioButtons from "./components/RadioButtons"
import Button from "./components/Button"
import PhotonSlider from "./components/Slider"
import Toggle from "./components/ToggleButton"
// class Button extends React.Component {


let colors = {
    sending: "pending",
    ready: "success",
    error: "error",
  };

let buttons = [
      {label:"Forward",value:"fwd"},
      {label:"Reverse", value: "reverse"}
    ];

let group1Bits = {
    F1: 1,
    F2: 2,
    F3: 4,
    F4: 8,
    F0: 16
}


    
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      onPressed: "ready",
      offPresssed: "ready",
      direction: "fwd",
      group1: 0,
      group2: 0,
      group3: 0
  };
    
    this.sendDcc("7","16");
    setTimeout ( (() => this.sendDcc("7","0")), 1000)
    
  }
  
  getColor(command){
    return colors[command] || "red"
  }
  
  sendDcc(operation, command) {
    return this.sendWithArgs("dcc", operation, command)
  }
  
  sendWithArgs(type, operation, command) {
    console.log("pressed", command);
    fetch(`https://api.particle.io/v1/devices/2d0028000b47353235303037/${type}Command`, {
            body: `arg=${operation},${command}&access_token=7272794e183736c5a14dce7ebd8ace2fb6fe5e56`,
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST"
          }).then((myJson) => {
      console.log("Success")
      console.log(myJson);
      window.myJson = myJson
      if(!myJson.ok) {throw new Error("not OK")}
      this.setState({[command + "Pressed"]:"ready"})
    }).catch(error => {console.error(error)
    this.setState({[command + "Pressed"]:"error"})
      })
  }
  
  render() {
    let handleChange = (value) => {
      console.log("Change value to " + value )
      this.setState({direction:value})
    }
    console.log("Constructed state Group1: "+this.state.group1)
    return <div>
              
                <Button content="Headlight (F0) ON" onClick={() => {
                    this.setState({onPressed:"sending"});
                    this.setState({group1: this.state.group1 | group1Bits.F0})
                    this.sendDcc("7", this.state.group1.toString())
                    console.log("Sending Group1 on State:"+this.state.group1)}
                    } 
                    variant={this.getColor(this.state.onPressed)} />
              
                <Button content="Headlight (F0) OFF" onClick={() => {
                    this.setState({onPressed:"sending"});
                    this.setState({group1: this.state.group1 & ~group1Bits.F0})
                    this.sendDcc("7", this.state.group1.toString())
                    console.log("Sending Group1 off State:"+this.state.group1)}
                    } 
                    variant={this.getColor(this.state.onPressed)} />
              
                <Button content="F1 ON" onClick={() => {
                    this.setState({onPressed:"sending"});
                    this.setState({group1: this.state.group1 | group1Bits.F1})
                    this.sendDcc("7", this.state.group1.toString())
                    console.log("Sending Group1 on State:"+this.state.group1)}
                    } 
                    variant={this.getColor(this.state.onPressed)} />
              
                <Button content="F1 OFF" onClick={() => {
                    this.setState({onPressed:"sending"});
                    this.setState({group1: this.state.group1 & ~group1Bits.F1})
                    this.sendDcc("7", this.state.group1.toString())
                    console.log("Sending Group1 off State:"+this.state.group1)}
                    } 
                    variant={this.getColor(this.state.onPressed)} />
              
                <Button content="FWD 0" onClick={() => {
                    this.setState({onPressed:"sending"});this.sendDcc("fwd128", "0")}
                    } 
                    variant={this.getColor(this.state.onPressed)} />
              <Button content="REV 0" onClick={() => {
                    this.setState({onPressed:"sending"});this.sendDcc("rev128", "0")}
                    } 
                    variant={this.getColor(this.state.onPressed)} />

              <RadioButtons
                  buttons={buttons}
                  selectedValue={this.state.direction}
                  onChange={handleChange}
              />

              <PhotonSlider max={126} onAfterChange={(val) => {
                    console.log("PhotonSlider::onAfterChange() value=",val)
                    if (this.state.direction==="fwd") {
                      this.sendDcc("4", val.toString())
                      console.log("Forward 128: "+val) 
                    }else{   
                      this.sendDcc("3", val.toString())
                      console.log("Reverse 128: "+val)
                    }}} />

              
                <Toggle
                  onToggle={(value) => {
                    if(value){
                            this.setState({group1: this.state.group1 | group1Bits.F1})
                    } else {
                            this.setState({group1: this.state.group1 & ~group1Bits.F1})
                    }
                     console.log(this.state.group1)
                  }} />


        </div>
  }    

}

export default App;
