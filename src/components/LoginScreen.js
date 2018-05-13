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
      <table>
        <tbody>
          <tr>
            <td>User:</td><td><input id="username" type="text" name="user"></input><br/></td>
          </tr>
          <tr>
            <td>Password:</td><td><input id="password" type="password" name="pass"></input></td>
          </tr>
          <tr >
            <td colSpan="2"><PictureButton class="loginBtn"  fn={this.handleLogin.bind(this)}/></td>
          </tr>
        </tbody>
      </table>

      
     {this.state.loginError ?  <p>Login Error</p> : <p/>}
  	</div>
  }
  
}

export default LoginScreen 