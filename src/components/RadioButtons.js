import React from 'react';
import {RadioGroup, Radio} from 'react-radio-group'

const localstyle = {
  group: {
    background: "white",
    color: "black",
    width: "400px",
    marginLeft: "10%",
    marginRight: "10%"
  }
  
}
let RadioButtons = React.createClass({
  getInitialState() {
    return {selectedValue: 'apple'};
  },

  handleChange(value) {
    this.setState({selectedValue: value});
  },

  render() {
    const { 
      buttons,
      selectedValue,
      style,
      onChange,
      ...others
    } = this.props;
   
    const controls = buttons.map( (button) => {
      return <label key={button.value} > 
            <Radio  value={button.value} />
          {button.label}
          <br/>
        </label>
        
    })
    
    return (
      <RadioGroup style={style||localstyle.group} {...others}
        name="fruit"
        selectedValue={selectedValue||buttons[0].value}
        onChange={onChange || this.handleChange}>
        {controls}
        
      </RadioGroup>
    );
  }
});
export default RadioButtons  