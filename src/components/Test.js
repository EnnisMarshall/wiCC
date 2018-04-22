import React from 'react';

class Test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isToggleOn: true};

    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    console.log("handleClick()")
    this.props.app[this.props.fn]()
  }

  render() {
    return (
      <button className={this.props.cls} onClick={this.handleClick}>{this.props.name}</button>
    );
  }
}

export default Test