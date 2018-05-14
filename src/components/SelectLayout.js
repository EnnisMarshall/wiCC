import React from 'react';

import ClickButton from "./ClickButton"
import PictureButton from "./PictureButton"

var particle = new window.Particle();  



class SelectLayout extends React.Component {
    constructor(props) {
      super(props)
    
    this.state = {
    	layouts: [ ]
    }
    
    var access = this.props.access
    console.log("SelectLayout.constructor() access=", access)
    var me = this
      
    particle.listDevices({ auth: access }).then(
      function(devices){
        console.log('SelectLayout() devices=', devices);
        me.setState({layouts:devices.body})
        
      },
      function(err) {
        console.log('SelectLayout() err= ', err);
      }
    )
    
    this.controlLayout = this.controlLayout.bind(this)
    this.logOut = this.logOut.bind(this)
  }

	controlLayout(layout) {
  	console.log("SelectLayout.controlLayout() layout=",layout)
    this.props.controlLayout(layout)
  }
  
  logOut() {
  	this.props.logOut()
  }
  
	render () {
    return <div className="selectLayout">
            <div className="layoutList">
              <h1>Layouts</h1>
              <ul>
              {this.state.layouts.map(layout => this.listItem(layout))}
              </ul>
              <PictureButton class="logOutBtn" fn={this.logOut.bind(this)} params=""/>
            </div>
          </div>
  }  
  
  listItem(layout) {
    var layoutConfig = {}
           
    try {
      layoutConfig = JSON.parse(layout.notes)
      console.log("layoutConfig",layoutConfig)
      
       if (layoutConfig.layout) {
        return  <li key={layout.id}>
           <ClickButton name={layout.name} fn={this.controlLayout.bind(this)} params={layout.id}/>
        </li>
      } else 
        return ""
    }
    catch (err){
      // error here is OK just bad JSON parse
    }  
  }
              
              
              
}
     
              
              

export default SelectLayout