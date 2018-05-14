import React from 'react';
import RadioButtons from "./RadioButtons"
import ClickButton from "./ClickButton"
import MomentaryButton from "./MomentaryButton"
import PictureButton from "./PictureButton"
import PhotonSlider from "./Slider"
import Toggle from "react-toggle"
import "react-toggle/style.css"
import Player from "./Player"

console.log("Particle is", window.Particle)
var particle = new window.Particle();  

const functionBits = {
        F1: 1, //these are the bits to set for each function in a function group
        F2: 2,
        F3: 4,
        F4: 8,
        F0: 16,
        F5: 1,
        F6: 2,
        F7: 4,
        F8: 8,
        F9: 1,
        F10: 2,
        F11: 4,
        F12: 8
      }

const groupOp = {
        group1: 7,
        group2: 8,
        group3: 9
      }

class ControlPanel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      buttons: [
      {label:"Forward",value:"fwd"},
      {label:"Reverse", value: "reverse"}
      ],
      onPressed: "ready",
      offPresssed: "ready",
      direction: "fwd",
      speed: "0",
      address: 0,
      group1: 0, // group1 is bits indicating what is active in function group 1
      group2: 0,
      group3: 0,
      fn: this.eStop,
      player: false,
      layoutConfig: {}
    }
    
    var layout = this.props.layout
    var access = this.props.access
    console.log("ControlPanel.constructor() access=", access)
    console.log("ControlPanel.constructor() layout=", layout)

    var me = this
      
    particle.getDevice({ deviceId: layout, auth: access }).then(
      function(device){
        
        try {
          var layoutConfig = JSON.parse(device.body.notes)
          console.log('ControlPanel.constructor() layoutConfig=', layoutConfig);
          me.setState({layoutConfig:layoutConfig}) 
          
        }
        catch (err) { // error here just means theres no config for this layout
        }
      },
      function(err) {
        console.log('ControlPanel() err= ', err);
      }
    )


  }
  
  
     
  sendDcc(operation, command) {
    console.log("sendDcc()")
    return this.sendWithArgs("dcc",operation, command)
  }
  

  
    sendWithArgs(type, operation, command) {
    var engine = document.getElementById("engine").value
    console.log("ControlPanel.sendWithArgs() deviceId=", this.props.layout)
    console.log("ControlPanel.sendWithArgs() accessToken=", this.props.access)

 
    
    console.log("sent to loco ="+engine);
    particle.callFunction({ deviceId: this.props.layout, name: `${type}Command`, argument: `${engine},${operation},${command}`, auth: this.props.access })
      .then((data) => {
      console.log("Success")
      console.log(data);
    },
     (error)=>{
      console.log("ControlPanel.sendWithArgs() error =",error)
      }
    )
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
  
  eStop() {
    console.log("eStop()")
   if( this.state.direction === "fwd"){
      this.sendDcc("6", "0")                                    
   } else {
      this.sendDcc("5", "0")
    }
  }
  faster() {
    var speed = this.state.speed - 0  // convert string to int by subtracting 0    
    speed += 5;
    speed = (speed > 126) ? 126 : speed;
    
    this.setState({speed: speed.toString()})
     
    if (this.state.direction==="fwd") {
      this.sendDcc("4", speed.toString())
      console.log("Forward 128: "+speed) 
    }else{   
      this.sendDcc("3", speed.toString())
      console.log("Reverse 128: "+speed)
    }
  }
  
  slower() {
    var speed = this.state.speed - 0  // convert string to int by subtracting 0    
    speed -= 5;
    speed = (speed < 0) ? 0 : speed;
    
    this.setState({speed: speed.toString()})
     
    if (this.state.direction==="fwd") {
      this.sendDcc("4", speed.toString())
      console.log("Forward 128: "+speed) 
    }else{   
      this.sendDcc("3", speed.toString())
      console.log("Reverse 128: "+speed)
    }
  }
  
  
      
  triggerHorn(on) {
   this.triggerFunction('group1',functionBits.F2,on)
  }
  
  exitLayout() {
  	this.props.exit()
 
  }

      
  render() {
    
    console.log('ControlPanel.render() this.state.layoutConfig=', this.state.layoutConfig)
    
      
    let handleChange = (value) => {
      console.log("Change value to " + value )
      this.setState({direction:value})
      if (value==="fwd") {
        this.sendDcc("4", this.state.speed)
        console.log("Forward 128: "+this.state.speed) 
      }else{   
        this.sendDcc("3", this.state.speed)
        console.log("Reverse 128: "+this.state.speed)
      }
    }
    
    
    return <div>
              <div>
              <table>
                <tbody>
                  <tr>
                    <td>
                      <ClickButton name="Exit RR" fn={this.exitLayout.bind(this)} params=""/>
                    </td>
                    <td>
                      Engine #:<input id="engine" type="address" name="address"></input>
                    </td>
                    <td>
                      <span className="toggle">  
                              <p className="label">Headlight (F0)</p>
                              <Toggle
                                  defaultChecked={(this.state.group1 & ~functionBits.F0) !== 0}
                                  onChange={(e)=>{
                                            this.triggerFunction('group1',functionBits.F0,e.target.checked)
                                            console.log("onChagne",e.target.checked)
                                           }
                                  }
                              />
                      </span>
                    </td>
                    <td>             
                      <MomentaryButton class="hornBtn" fn={this.triggerHorn.bind(this)}/> 
                    </td>
                  </tr>
                </tbody>
              </table>

              </div>
          <table>
            <tbody>
              <tr>
               <td>
              <table>
                <tbody>
                  <tr>
                    <td>
                      <span className="toggle">  
                        <p className="label">Bell (F1)</p>
                        <Toggle
                            defaultChecked={(this.state.group1 & ~functionBits.F1) !== 0}
                            onChange={(e)=>{
                                      this.triggerFunction('group1',functionBits.F1,e.target.checked)
                                      console.log("onChagne",e.target.checked)
                                     }
                            }
                        />
                      </span>
                    </td>

                    <td>
                      <span className="toggle">  
                        <p className="label">F2</p>
                        <Toggle
                            defaultChecked={(this.state.group1 & ~functionBits.F2) !== 0}
                            onChange={(e)=>{
                                      this.triggerFunction('group1',functionBits.F2,e.target.checked)
                                      console.log("onChagne",e.target.checked)
                                     }
                            }
                        />
                      </span>
                    </td>

                    <td>
                      <span className="toggle">  
                        <p className="label">F3</p>
                        <Toggle
                            defaultChecked={(this.state.group1 & ~functionBits.F3) !== 0}
                            onChange={(e)=>{
                                      this.triggerFunction('group1',functionBits.F3,e.target.checked)
                                      console.log("onChagne",e.target.checked)
                                     }
                            }
                        />
                      </span>
                    </td>

                    <td>
                      <span className="toggle">  
                        <p className="label">F4</p>
                        <Toggle
                            defaultChecked={(this.state.group1 & ~functionBits.F4) !== 0}
                            onChange={(e)=>{
                                      this.triggerFunction('group1',functionBits.F4,e.target.checked)
                                      console.log("onChagne",e.target.checked)
                                     }
                            }
                        />
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className="toggle">  
                        <p className="label">F5</p>
                        <Toggle
                            defaultChecked={(this.state.group2 & ~functionBits.F5) !== 0}
                            onChange={(e)=>{
                                      this.triggerFunction('group2',functionBits.F5,e.target.checked)
                                      console.log("onChagne",e.target.checked)
                                     }
                            }
                        />
                      </span>
                    </td>

                    <td>
                      <span className="toggle">  
                        <p className="label">F6</p>
                        <Toggle
                            defaultChecked={(this.state.group2 & ~functionBits.F6) !== 0}
                            onChange={(e)=>{
                                      this.triggerFunction('group2',functionBits.F6,e.target.checked)
                                      console.log("onChagne",e.target.checked)
                                     }
                            }
                        />
                      </span>
                    </td>
                  
                    <td>
                      <span className="toggle">  
                        <p className="label">F7</p>
                        <Toggle
                            defaultChecked={(this.state.group2 & ~functionBits.F7) !== 0}
                            onChange={(e)=>{
                                      this.triggerFunction('group2',functionBits.F7,e.target.checked)
                                      console.log("onChagne",e.target.checked)
                                     }
                            }
                        />
                      </span>
                    </td>

                    <td>
                      <span className="toggle">  
                        <p className="label">F8</p>
                        <Toggle
                            defaultChecked={(this.state.group2 & ~functionBits.F8) !== 0}
                            onChange={(e)=>{
                                      this.triggerFunction('group2',functionBits.F8,e.target.checked)
                                      console.log("onChagne",e.target.checked)
                                     }
                            }
                        />
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className="toggle">  
                        <p className="label">F9</p>
                        <Toggle
                            defaultChecked={(this.state.group3 & ~functionBits.F9) !== 0}
                            onChange={(e)=>{
                                      this.triggerFunction('group3',functionBits.F9,e.target.checked)
                                      console.log("onChagne",e.target.checked)
                                     }
                            }
                        />
                      </span>
                    </td>

                    <td>
                      <span className="toggle">  
                        <p className="label">F10</p>
                        <Toggle
                            defaultChecked={(this.state.group3 & ~functionBits.F10) !== 0}
                            onChange={(e)=>{
                                      this.triggerFunction('group3',functionBits.F3,e.target.checked)
                                      console.log("onChagne",e.target.checked)
                                     }
                            }
                        />
                      </span>
                    </td>

                    <td>
                      <span className="toggle">  
                        <p className="label">F11</p>
                        <Toggle
                            defaultChecked={(this.state.group3 & ~functionBits.F11) !== 0}
                            onChange={(e)=>{
                                      this.triggerFunction('group3',functionBits.F11,e.target.checked)
                                      console.log("onChagne",e.target.checked)
                                     }
                            }
                        />
                      </span>
                    </td>

                    <td>
                      <span className="toggle">  
                        <p className="label">F12</p>
                        <Toggle
                            defaultChecked={(this.state.group3 & ~functionBits.F12) !== 0}
                            onChange={(e)=>{
                                      this.triggerFunction('group3',functionBits.F12,e.target.checked)
                                      console.log("onChagne",e.target.checked)
                                     }
                            }
                        />
                      </span>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </td>
              <td>
                <table>
                  <tbody>
                    <tr>
                      <td>
                          {this.state.speed}
                      </td>
                    </tr>
                    <tr>
                      <td>
                         <PhotonSlider max={126} onAfterChange={(val) => {
                            console.log("PhotonSlider::onAfterChange() value=",val)
                            this.setState({speed: val.toString()})
                            if (this.state.direction==="fwd") {
                              this.sendDcc("4", val.toString())
                              console.log("Forward 128: "+val) 
                            }else{   
                              this.sendDcc("3", val.toString())
                              console.log("Reverse 128: "+val)
                            }}} 
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>

              </td>
              <td>
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <RadioButtons
                            buttons={this.state.buttons}
                            selectedValue={this.state.direction}
                            onChange={handleChange}
                        />
                      </td>
                    </tr>
                    <tr>
                     <td>
                        <PictureButton class="stopBtn" fn={this.eStop.bind(this)}/>
                     </td>
                    </tr>
                    <tr>
                     <td>
                        <ClickButton class="" name="Faster" fn={this.faster.bind(this)}/>
                     </td>
                    </tr>
                    <tr>
                     <td>
                        <ClickButton class="" name="Slower" fn={this.slower.bind(this)}/>
                     </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
          
            
          {this.state.layoutConfig.cam ? <Player url={this.state.layoutConfig.url} /> : ""}
        </div>
  }
}

export default ControlPanel