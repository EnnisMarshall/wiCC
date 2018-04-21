import React, { Component } from 'react';

import './App.css';

import RadioButtons from "./components/RadioButtons"
import Button from "./components/Button"
import PhotonSlider from "./components/Slider"
import Toggle from "react-toggle"
import "react-toggle/style.css"
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

let functionBits = {
    F1: 1, //these are the bits to set for each function in a function group
    F2: 2,
    F3: 4,
    F4: 8,
    F0: 16,
    F5: 1,
    F6: 2
}

const groupOp = {
    group1: 7,
    group2: 8,
    group3: 9
  }
    
class App extends Component {
  
  
 
  
  constructor(props) {
    super(props);
    this.state = {
      onPressed: "ready",
      offPresssed: "ready",
      direction: "fwd",
      group1: 0, // group1 is bits indicating what is active in function group 1
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
  
  triggerFunction(group, bits, on){ 
    var o = {}  //empty javascript object
    
    if (on)
      o[group] = this.state[group] | bits  //o["group1"] is the same as o.group1
    else
      o[group] = this.state[group] & ~bits
    
    console.log("o=",o)
    
    this.setState({onPressed:"sending"})
    this.sendDcc(groupOp[group], o[group])
    this.setState(o)
    console.log(`Sending group=${group} bits ${o[group]}`)
  }
    

  render() {
    let handleChange = (value) => {
      console.log("Change value to " + value )
      this.setState({direction:value})
    }
    console.log("Constructed state Group1: "+this.state.group1)
    return <div>
        <table>
          <tr>
            <td>
              <span class="toggle">  
                <p class="label">Headlight</p>
                <Toggle
                    defaultChecked={this.state.group1 & ~functionBits.F0}
                    onChange={(e)=>{
                              this.triggerFunction('group1',functionBits.F0,e.target.checked)
                              console.log("onChagne",e.target.checked)
                             }
                    }
                />
              </span>
            </td>

            <td>
              <span class="toggle">  
                <p class="label">Bell</p>
                <Toggle
                    defaultChecked={this.state.group1 & ~functionBits.F1}
                    onChange={(e)=>{
                              this.triggerFunction('group1',functionBits.F1,e.target.checked)
                              console.log("onChagne",e.target.checked)
                             }
                    }
                />
              </span>
            </td>

            <td>
              <span class="toggle">  
                <p class="label">Function 3</p>
                <Toggle
                    defaultChecked={this.state.group1 & ~functionBits.F3}
                    onChange={(e)=>{
                              this.triggerFunction('group1',functionBits.F3,e.target.checked)
                              console.log("onChagne",e.target.checked)
                             }
                    }
                />
              </span>
            </td>
          </tr>
        </table>


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

        
                
        </div>
  }    

}

export default App;

