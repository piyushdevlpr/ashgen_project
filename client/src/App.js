import React, { Component } from 'react';
import './App.css';

class App extends Component {
   _ismounted = false ;
  constructor(props){
    super(props);
    this.state = {
        username: '',
        password: '',
        emailid: '',
        login: false ,
        loggedin : false ,
        signedup : false
    }
    this.handleChange = this.handleChange.bind(this);
    this.click = this.click.bind(this);
    this.click2 = this.click2.bind(this);
    // this.gotohome = this.gotohome.bind(this);
    // this.gotohomeforfirst = this.gotohomeforfirst.bind(this);
}
componentDidMount(){
  this._ismounted = true ;
  this.setState({
    username: '',
    password: '',
    emailid: '',
    login: false ,
    loggedin : false ,
    signedup : false
  })
}
componentWillUnmount(){
  this._ismounted = false ;
}
click=(event)=>{
  event.preventDefault() ;
  if(this._ismounted === true){
  console.log(this.state) ;
  fetch("http://localhost:2000/register", {
    method: "POST",
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(this.state)
  }).then(res => res.json()).then(data => {if(this._ismounted === true){this.setState({signedup : data})}})
  console.log(this.state) ;
}
}
handleChange=(event)=>{
    event.preventDefault() ;
    this.setState({
      [event.target.name]: event.target.value
    })
}
click2=(event)=>{
  event.preventDefault() ;
  if(this._ismounted === true){
  console.log(this.state) ;
  fetch("http://localhost:2000/login", {
    method: "POST",
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(this.state)
  }).then(res => res.json()).then(data => {if(this._ismounted === true){this.setState({loggedin : data})}})
  console.log(this.state) ;
  }
}
gotohome=()=>{
  //event.preventDefault();
  if(this.state.loggedin === "true" && this._ismounted === true){
    this.props.history.push({
    pathname: '/home/',
    state: {
      loggedin: "true",
      signedup: false,
      username: this.state.username,
      emailid: this.state.emailid
    }
  });
  }
}
gotohomeforfirst=()=>{
  //event.preventDefault();
  if(this.state.signedup === "true" && this._ismounted === true){
    this.props.history.push({
      pathname: '/home/',
      state: {
        loggedin: false,
        signedup: "true",
        username: this.state.username,
        emailid: this.state.emailid
      }
    });
  }
}
getlogin=()=>{
  return(
  <div>
  <form onSubmit={this.click2} method='POST' action='http://localhost:2000/login'>
  <div>
      <input className='form-control' type='text' placeholder='USERNAME' name='username' value={this.state.username}  onChange={this.handleChange}></input><br/>
      <input className='form-control' type='password' placeholder='PASSWORD' name='password' value={this.state.password} onChange={this.handleChange}></input><br/>
      <button>LOGIN</button>
      {/* <span> OR </span> */}
      {/* <button className='btn btn-default addallborder' onClick={()=>this.getsignup()}>SIGN UP</button> */}
      {this.gotohome()}
  </div>
  </form>
  </div>
  )
};
getsignup=()=>{
  return(
  <div>
    
    <form onSubmit={this.click} method='POST' action='http://localhost:2000/register'>	
									
													
                  <input id="login-firstname" type="text" className="background form-control" name='username' value={this.state.username} placeholder="USER NAME (MAX. LENGTH 6)" minLength="6" maxLength="6" required={true} onChange={this.handleChange}/>
                            
                              
                  <input id="login-email" type="email" className="background form-control" name="emailid" value={this.state.emailid} placeholder="EMAIL ID" required={true} onChange={this.handleChange} /> 
                            
                  <input id="Password" type="password" className="background form-control" name='password' value={this.state.password} placeholder="PASSWORD" minLength="6" required={true} onChange={this.handleChange} />
                  
                  {/* <input id="ConfirmPassword" type="password" class="background form-control" name="confpassword" placeholder="CONFIRM-PASSWORD" minlength="6" required="true" onChange={this.handleChange} /> */}
                    
                  <button>SIGN UP</button>
                        
              </form>
              {this.gotohomeforfirst() }
  </div>
  );
}
logintrue=()=>{
  if(this._ismounted){
  this.setState({login : true}) ;
  }//event.preventDefault();
  //event.target.classList.add('lohgintrue') ;
}
loginfalse=()=>{
  if(this._ismounted){
  this.setState({login : false});
}
}
loginorsignup=()=>{
  if(this.state.login === true){
      return this.getlogin() ;
  }else{
      return this.getsignup();
  }
}
  render() {
    return (
      <div className="App">
           <div className ='container mt-3'>
            <button className={'col-sm-6 btn btn-default addallborder login'+this.state.login } onClick={()=>this.logintrue()}>LOGIN</button><button className={'col-sm-6 btn btn-default addallborder login'+!this.state.login} onClick={()=>this.loginfalse()}>SIGNUP</button>
            {this.loginorsignup()}
          </div>
          {console.log(this.state)} 
      </div>
    );
  }
}

export default App;