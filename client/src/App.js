import React, { Component } from 'react';
import './App.css';

class App extends Component {
   _ismounted = true ;
  constructor(props){
    super(props);
    this.state = {
        username: '',
        password: '',
        emailid: '',
        login: false ,
        team:false,
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

  //https://ojus-server-132kgu2rdjqbfc.herokuapp.com
  fetch("http://localhost:2000/register", {
    method: "POST",
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(this.state),
    credentials:'include'
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
    body: JSON.stringify(this.state),
     credentials: 'include'
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
gotohomeprofile=()=>{
  //event.preventDefault();
  if(this.state.signedup === "true" && this._ismounted === true){
    this.props.history.push({
      pathname: '/your-profile/',
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
  <form onSubmit={this.click2} method='POST' action='https://ojus-server-132kgu2rdjqbfc.herokuapp.com/login'>
  <div>
      <input className='form-control' type='text' placeholder='USERNAME' name='username' value={this.state.username}  onChange={this.handleChange}></input><br/>
      <input className='form-control' type='password' placeholder='PASSWORD' name='password' value={this.state.password} onChange={this.handleChange}></input><br/>
      <button className='btn btn-default addallborder'>LOGIN</button>
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
    
    <form onSubmit={this.click} method='POST' action='https://ojus-server-132kgu2rdjqbfc.herokuapp.com/register'>	
									
													
                  <input id="login-firstname" type="text" className="background form-control" name='username' value={this.state.username} placeholder="USER NAME (MAX. LENGTH 6)" minLength="6" maxLength="6" required={true} onChange={this.handleChange}/><br/>
                            
                              
                  <input id="login-email" type="email" className="background form-control" name="emailid" value={this.state.emailid} placeholder="EMAIL ID" required={true} onChange={this.handleChange} /><br/> 
                            
                  <input id="Password" type="password" className="background form-control" name='password' value={this.state.password} placeholder="PASSWORD" minLength="6" required={true} onChange={this.handleChange} /><br/>
                  
                  {/* <input id="ConfirmPassword" type="password" class="background form-control" name="confpassword" placeholder="CONFIRM-PASSWORD" minlength="6" required="true" onChange={this.handleChange} /> */}
                    
                  <button className='btn btn-default addallborder'>SIGN UP</button>
                        
              </form>
              {this.gotohomeprofile() }
  </div>
  );
}
teamtrue=()=>{
  if(this._ismounted){
  this.setState({team : true}) ;
  }//event.preventDefault();
  //event.target.classList.add('lohgintrue') ;
}
teamfalse=()=>{
  if(this._ismounted){
  this.setState({team : false});
}
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
teamorind=()=>{
  if(this.state.team === true){
      return this.getteam() ;
  }else{
      return this.getind();
  }
}
loginorsignup=()=>{
  if(this.state.login === true){
      return this.getlogin() ;
  }else{
      return this.getsignup();
  }
}
click4=(event)=>{
  event.preventDefault() ;
  if(this._ismounted === true){
  console.log(this.state) ;
  fetch("http://localhost:2000/registerteam", {
    method: "POST",
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(this.state)
  }).then(res => res.json()).then(data => {if(this._ismounted === true){this.setState({signedup : data})}})
  console.log(this.state) ;
}
}
click3=(event)=>{
  event.preventDefault() ;
  if(this._ismounted === true){
  console.log(this.state) ;
  fetch("http://localhost:2000/loginteam", {
    method: "POST",
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(this.state)
  }).then(res => res.json()).then(data => {if(this._ismounted === true){this.setState({loggedin : data})}})
  console.log(this.state) ;
  }
}
getloginteam=()=>{
  return(
  <div>
  <form onSubmit={this.click3} method='POST' action='https://ojus-server-132kgu2rdjqbfc.herokuapp.com/loginteam'>
  <div> 
      <input className='form-control' type='text' placeholder='USERNAME' name='username' value={this.state.username}  onChange={this.handleChange}></input><br/>
      <input className='form-control' type='password' placeholder='PASSWORD' name='password' value={this.state.password} onChange={this.handleChange}></input><br/>
      <button className='btn btn-default addallborder'>LOGIN</button>
      {/* <span> OR </span> */}
      {/* <button className='btn btn-default addallborder' onClick={()=>this.getsignup()}>SIGN UP</button> */}
      {this.gotohome()}
  </div>
  </form>
  </div>
  )
};
gotohometeamprofile=()=>{
  if(this.state.signedup === "true" && this._ismounted === true){
    this.props.history.push({
      pathname: '/team-profile/',
      state: {
        loggedin: false,
        signedup: "true",
        username: this.state.username,
        emailid: this.state.emailid
      }
    });
  }
}
getsignupteam=()=>{
  return(
  <div>    
    <form onSubmit={this.click4} method='POST' action='https://ojus-server-132kgu2rdjqbfc.herokuapp.com/registerteam'>	
                  <input id="login-firstname" type="text" className="background form-control" name='username' value={this.state.username} placeholder="TEAMNAME (MAX. LENGTH 6)" minLength="6" maxLength="6" required={true} onChange={this.handleChange}/><br/>
                  <input id="login-email" type="email" className="background form-control" name="emailid" value={this.state.emailid} placeholder="EMAIL ID" required={true} onChange={this.handleChange} /><br/> 
                  <input id="Password" type="password" className="background form-control" name='password' value={this.state.password} placeholder="PASSWORD" minLength="6" required={true} onChange={this.handleChange} /><br/>
                  {/* <input id="ConfirmPassword" type="password" class="background form-control" name="confpassword" placeholder="CONFIRM-PASSWORD" minlength="6" required="true" onChange={this.handleChange} /> */}
                  <button className='btn btn-default addallborder'>SIGN UP</button>                       
              </form>
              {this.gotohometeamprofile() }
  </div>
  );
}
loginorsignupteam=()=>{
  if(this.state.login === true){
      return this.getloginteam() ;
  }else{
      return this.getsignupteam();
  }
}
getteam=()=>{
  return( 
    <div className ='container mt-3'>
       <button className={'col-sm-6 btn btn-default addallborder login'+this.state.login } onClick={()=>this.logintrue()}>LOGIN</button><button className={'col-sm-6 btn btn-default addallborder login'+!this.state.login} onClick={()=>this.loginfalse()}>SIGNUP</button><br/>
       {this.loginorsignupteam()}
     </div>
    );
}
getind=()=>{
         return( 
         <div className ='container mt-3'>
<button className={'col-sm-6 btn btn-default addallborder login'+this.state.login } onClick={()=>this.logintrue()}>LOGIN</button><button className={'col-sm-6 btn btn-default addallborder login'+!this.state.login} onClick={()=>this.loginfalse()}>SIGNUP</button><br/>            
{this.loginorsignup()}
          </div>
         );
}
render() {
    return (
      <div className="App container mt-3">
      <div>
        <button className={'col-sm-6 btn btn-default addallborder login'+!this.state.team } onClick={()=>this.teamfalse()}>INDIVIDUAL</button><button className={'col-sm-6 btn btn-default addallborder login'+this.state.team} onClick={()=>this.teamtrue()}>TEAM</button>
        {this.teamorind()}           
          {console.log(this.state)} 
      </div>
       </div>
    );
  }
}

export default App;
