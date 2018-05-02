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
      <ol>
            <PictureButton class="logOutBtn" fn={this.logOut.bind(this)} params=""/>


        {this.state.layouts.map(layout => <li key={layout.id}>
          <ClickButton name={layout.name} fn={this.controlLayout.bind(this)} params={layout.id}/>
        </li>)} 
      </ol>

      </div>
  }
}

export default SelectLayout