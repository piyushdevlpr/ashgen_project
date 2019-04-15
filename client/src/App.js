import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
        username: '',
        password: '',
        emailid:'',
        login: false ,
        loggedin : false ,
        signedup : false
    }
    this.handleChange = this.handleChange.bind(this);
    this.click = this.click.bind(this);
    this.click2 = this.click2.bind(this);
}
click(event){
  event.preventDefault() ;
  console.log(this.state) ;
  fetch("http://localhost:3000/register", {
    method: "POST",
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(this.state)
  }).then(res => res.json()).then(data => this.setState({signedup : data}))
  console.log(this.state) ;
}
handleChange(event){
    event.preventDefault() ;
    this.setState({
      [event.target.name]: event.target.value
    })
}
click2(event){
  event.preventDefault() ;
  console.log(this.state) ;
  fetch("http://localhost:3000/login", {
    method: "POST",
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(this.state)
  }).then(res => res.json()).then(data => this.setState({loggedin : data}))
  console.log(this.state) ;
}
getlogin(){
  return(
  <div>
    
  <form onSubmit={this.click2} method='POST' action='http://localhost:3000/login'>
  <div>
      <input className='form-control' type='text' placeholder='USERNAME' name='username' value={this.state.username}  onChange={this.handleChange}></input><br/>
      <input className='form-control' type='password' placeholder='PASSWORD' name='password' value={this.state.password} onChange={this.handleChange}></input><br/>
      <button>LOGIN</button>
      {/* <span> OR </span> */}
      {/* <button className='btn btn-default addallborder' onClick={()=>this.getsignup()}>SIGN UP</button> */}
  </div>
  </form>
  </div>
  )
};
getsignup(){
  return(
  <div>
    
    <form onSubmit={this.click} method='POST' action='http://localhost:3000/register'>	
									
													
                  <input id="login-firstname" type="text" className="background form-control" name='username' value={this.state.username} placeholder="USER NAME (MAX. LENGTH 6)" minLength="6" maxLength="6" required={true} onChange={this.handleChange}/>
                            
                              
                  <input id="login-email" type="email" className="background form-control" name="emailid" value={this.state.emailid} placeholder="EMAIL ID" required={true} onChange={this.handleChange} /> 
                            
                  <input id="Password" type="password" className="background form-control" name='password' value={this.state.password} placeholder="PASSWORD" minLength="6" required={true} onChange={this.handleChange} />
                  
                  {/* <input id="ConfirmPassword" type="password" class="background form-control" name="confpassword" placeholder="CONFIRM-PASSWORD" minlength="6" required="true" onChange={this.handleChange} /> */}
                    
                  <button>SIGN UP</button>
                        
              </form>
  </div>
  );
}
logintrue(){
  this.setState({login : true}) ;
  //event.preventDefault();
  //event.target.classList.add('lohgintrue') ;
}
loginfalse(){
  this.setState({login : false});
}
loginorsignup(){
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
