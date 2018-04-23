import React, { Component } from 'react'
import ReactPlayer from 'react-player'
 
class Player extends Component {
  render () {
    return <ReactPlayer url='https://youtu.be/q8wLrcWAVQo' playing />
  }
}

export default Player