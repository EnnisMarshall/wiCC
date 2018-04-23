import React from 'react';

console.log("Particle is", window.Particle)
var particle = new window.Particle();  

import ClickButton from "./ClickButton"

class LoginScreen extends React.Component{
  constructor(props){
    super(props)
    
    this.state= {
      loginError: false
    }
  }
  
  handleLogin(){
   var username = document.getElementById("username").value
   var password = document.getElementById("password").value
   var app = this.props.app
   var me = this
   var loginURL = `api.particle.io/v1/devices/`
   
   this.setState({loginError: false})
    
   particle.login({ username: username, password: password }).then(
      (data) => {
        console.log('login() data=', data.body);
        app.setState({ loggedIn:true});
        app.setState({access:data.body.access_token});
        
        console.log('Login successful! myAccessToken=', app.state.access);
      },
      (err) => {
        console.log('handleLogin() err=', err);
        app.setState({loggedIn:false});
        app.setState({access:""});
        me.setState({loginError:true})
      }
    )
  }
  
  render () {
  	console.log("loginScreen::render()")
    
  	return <div>
    	User:<input id="username" type="text" name="username"></input><br/>
      Password:<input id="password" type="password" name="password"></input>
      <ClickButton class="loginBtn" name="Login" fn={this.handleLogin.bind(this)}/>
      
     {this.state.loginError ?  <p>Login Error</p> : <p/>}
  	</div>
  }
  
}

export default LoginScreen 