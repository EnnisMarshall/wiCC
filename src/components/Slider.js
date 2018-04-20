import React from 'react';

import Slider  from 'rc-slider';
import Tooltip from 'rc-tooltip';
// We can just import Slider or Range to reduce bundle size
// import Slider from 'rc-slider/lib/Slider';
// import Range from 'rc-slider/lib/Range';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
const style = {float: 'left', width: 200, height: 400, marginBottom: 160, marginLeft: 50};
//const parentStyle = {overflow: 'hidden'};
const Handle = Slider.Handle;

const handle = (props) => {
  const { value, dragging, index, ...restProps } = props;
  return (
    <Tooltip
      prefixCls="rc-slider-tooltip"
      overlay={value}
      visible={dragging}
      placement="top"
      key={index}
    >
      <Handle value={value} {...restProps} />
    </Tooltip>
  );
};



class PhotonSlider extends React.Component {
  render() {
    const { 
      onAfterChange,
      ...others
    } = this.props;
    return <div style={style}>
      <Slider vertical step={1} defaultValue={0} handle={handle} max={this.props.max} 
        onAfterChange={onAfterChange} {...others}/>
      </div>;
  }
  
  f(v) {
    console.log("Slider value",v)
  }
}
  
export default PhotonSlider