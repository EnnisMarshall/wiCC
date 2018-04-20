import React from 'react';

import ToggleButton from 'react-toggle-button'

class Toggle extends React.Component {

  render() {
    const { 
      value,
      onToggle,
      ...others
    } = this.props;
    
    return (
      <ToggleButton
        value={ this.props.value || false }
        onToggle={(value) => {
        this.props.setValue({
        value: !value,
        })
        }} />

    )
  }
}
export default Toggle