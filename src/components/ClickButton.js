import React from 'react';

class ClickButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    console.log("ClickButton.handleClick()")
    this.props.fn()
  }

  render() {
    return (
      <button className={this.props.class} onClick={this.handleClick}>{this.props.name}</button>
    );
  }
}

export default ClickButton