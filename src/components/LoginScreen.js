import React from 'react';

console.log("Particle is", window.Particle)
var particle = new window.Particle();  

//import ClickButton from "./ClickButton"
import PictureButton from "./PictureButton"

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
   console.log("Constructor.handleLogin() username=",username)
   console.log("Constructor.handleLogin() password=",password)
   
   this.setState({loginError: false})
    
   particle.login({ username: username, password: password }).then(
      (data) => {
        console.log('login() data=', data.body);
        app.setState({access:data.body.access_token});
        app.setState({ loggedIn:true});
        
        
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
    
  	return <div className="loginScreen">
              <div className="loginForm">
                <p>wiCC Model Railroad Controller</p>
                <h1>Login</h1>

                <label htmlFor="email"><b>Email</b></label>
                <input type="text" placeholder="Enter Email" id="username" name="email" required/>

                <label htmlFor="psw"><b>Password</b></label>
                <input type="password" placeholder="Enter Password" id="password" name="psw" required/>

                <PictureButton name="Login" class="loginBtn" fn={this.handleLogin.bind(this)}/>
                {this.state.loginError ?  <p>Login Error</p> : <p/>}
              </div>

  	</div>
  }
  
}

export default LoginScreen 