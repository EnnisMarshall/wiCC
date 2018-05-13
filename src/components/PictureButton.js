import React from 'react';


class PictureButton extends React.Component {
	
  constructor(props) {
  	super(props)
    this.state = {
    }
    
    this.click = this.click.bind(this); // makes this available within click()
  }

	click() {
  	this.props.fn()
  }

	render() {
  	return  <div>
  	  <img className={this.props.class} onClick={this.click} alt={this.props.class}/>
  	</div>
  }
}

export default PictureButton