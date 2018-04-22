import React from 'react';

import { TextField, validator } from 'react-textfield';


class TextField extends React.Component {

  render() {
    
    const{
      name,
      placeholder,
      validators,
      ...others
    } =  this.props
    
    return (
  
 
  <ReactTextField
    name={name}
    placeholder={placeholder}
    validators={validators}
    successMessage={this.props.message}
  />

    )
  }
}
export default TextField