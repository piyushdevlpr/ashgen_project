import React, { Component } from 'react';
import './App.css';

class Login extends Component {
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
        signedup : false,
        isTeam:null,
    }
    this.handleChange = this.handleChange.bind(this);
    this.click2 = this.click2.bind(this);
    this.click3 = this.click3.bind(this);
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
// click=(event)=>{
//   event.preventDefault() ;
//   if(this._ismounted === true){
//   // console.log(this.state) ;

//   //https://ojus-server-132kgu2rdjqbfc.herokuapp.com
//   fetch("http://localhost:2000/register",{
//     // fetch("https://ojus-server-132kgu2rdjqbfc.herokuapp.com/register",{
//     method: "POST",
//     headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
//     body: JSON.stringify(this.state),
//     credentials:'include'
//   }).then(res => res.json()).then(data => {if(this._ismounted === true){this.setState({signedup : data})}})
//   // console.log(this.state) ;
// }
// }
handleChange=(event)=>{
    event.preventDefault() ;
    this.setState({
      [event.target.name]: event.target.value
    })
}
click2=(event)=>{
  event.preventDefault() ;
  if(this._ismounted === true){
  // console.log(this.state) ;
  fetch("http://localhost:2000/loginind", {
  // fetch("https://ojus-server-132kgu2rdjqbfc.herokuapp.com/login", {
    method: "POST",
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(this.state),
    credentials: 'include'
  }).then(res => res.json()).then(data => {if(this._ismounted === true){this.setState({loggedin : data})}})
  // console.log(this.state) ;
  }
}
click3=(event)=>{
  event.preventDefault() ;
  if(this._ismounted === true){
  // console.log(this.state) ;
  // fetch("https://ojus-server-132kgu2rdjqbfc.herokuapp.com/login", {

  fetch("http://localhost:2000/login", {
    method: "POST",
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(this.state),
    credentials: 'include'
  }).then(res => res.json()).then(data => {if(this._ismounted === true){
    this.setState({isTeam:data.team},()=>{this.setState({loggedin:data.status})})}})
  // console.log(this.state) ;
  }
}
gotohome=()=>{
  //event.preventDefault();
  if(this.state.loggedin == true && this._ismounted === true){
    this.props.history.push({
    pathname: '/home/',
    state: {
      loggedin: "true",
      signedup: false,
      username: this.state.username,
      emailid: this.state.emailid,
      isTeam:this.state.isTeam
    }
  });
  }
}
gotohome3rdpartyuser=()=>{
  //event.preventDefault();
  if(this.state.loggedin === "true" && this._ismounted === true){
    this.props.history.push({
    pathname: '/home-individual/',
    state: {
      loggedin: "true",
      signedup: false,
      username: this.state.username,
      emailid: this.state.emailid
    }
  });
  }
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
teamorind=()=>{
  if(this.state.team === true){
      return this.getteam() ;
  }else{
      return this.getind();
  }
}

getloginteam=()=>{
  return(
  <div>
  <form onSubmit={this.click3} method='POST' action='http://localhost:2000/login'>
  <div> 
      <input className='form-control' type='text' placeholder='USERNAME' name='username' value={this.state.username}  onChange={this.handleChange}></input><br/>
      <input className='form-control' type='password' placeholder='PASSWORD' name='password' value={this.state.password} onChange={this.handleChange}></input><br/>
      <button className='btn btn-default addallborder'>LOGIN</button>
      {this.gotohome()}
  </div>
  </form>
  </div>
  )
};
getlogin=()=>{
  return(
  <div>
  <form onSubmit={this.click2} method='POST' action='http://localhost:2000/loginind'>
  <div>
      <input className='form-control' type='text' placeholder='USERNAME' name='username' value={this.state.username}  onChange={this.handleChange}></input><br/>
      <input className='form-control' type='password' placeholder='PASSWORD' name='password' value={this.state.password} onChange={this.handleChange}></input><br/>
      <button className='btn btn-default addallborder'>LOGIN</button>
      {this.gotohome3rdpartyuser()}
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
getteam=()=>{
  return( 
    <div className ='container mt-3'>
       {this.getloginteam()}
     </div>
    );
}
getind=()=>{
         return( 
         <div className ='container mt-3'>
            {this.getlogin()}
          </div>
         );
}
render() {
    return (
      <div className="App container mt-3">
      <div>
        <button className={'col-sm-6 btn btn-default addallborder login'+!this.state.team } onClick={()=>this.teamfalse()}>INDIVIDUAL</button><button className={'col-sm-6 btn btn-default addallborder login'+this.state.team} onClick={()=>this.teamtrue()}>TEAM/TEAM MEMBER</button>
        {this.teamorind()}           
          {/* {console.log(this.state)}  */}
      </div>
       </div>
    );
  }
}

export default Login;
