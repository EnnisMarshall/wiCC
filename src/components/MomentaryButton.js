import React from 'react';


class MomentaryButton extends React.Component {
   constructor(props) {
  	super(props)
    this.state = {
    }
    
    this.start = this.start.bind(this); // makes this available within start()
    this.stop = this.stop.bind(this);//makes this available within stop()
  }

	start() {
    console.log("MomentaryButton.start()")
  	this.props.fn(true)
  }
  
  stop(){
    console.log("MomentaryButton.stop()")
    this.props.fn(false)
  }

	render() {
  	return  <div>
  	  <img className={this.props.class} onMouseDown={this.start} onMouseUp={this.stop} alt={this.props.class}/>
  	</div>
  }
}

export default MomentaryButton