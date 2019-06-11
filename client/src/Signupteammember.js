import React, { Component } from 'react';
import './App.css';

class App extends Component {
   _ismounted = true ;
  constructor(props){
    super(props);
    this.state = {
        teamid : "",
        personid : "",
        valid : "not-set" ,
        val : false,
        loading : true,
        emailid : "",
        username:'',
        password:'' 
    }
    this.submitform = this.submitform.bind(this) ;
    this.handleChange = this.handleChange.bind(this) ; 
}
getids=()=>{
    var id = this.props.location.pathname.slice(21) ;
    var teamid = "";
    for(var i = 0 ; i < id.length ; i++){
        if(id[i] !== '-'){
            teamid = teamid+id[i] ;
        }else{
            break ;
        }
    }
    var personid = id.slice(i+1) ;
    this.setState({personid:personid,teamid:teamid},function(){
        if(this.state.teamid && this.state.personid){
            this.setState({valid:true},function(){
                    this.getinformation() ;
                console.log(this.state) ;
            })
          }else{
            this.setState({valid:false},function(){
                console.log(this.state) ;
            })
        }
    });
}
getinformation=()=>{
    fetch("http://localhost:2000/get-info-requestedmember", {
        // fetch("https://ojus-server-132kgu2rdjqbfc.herokuapp.com/get-friends", {
            method: "POST",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body : JSON.stringify(this.state) ,
            credentials:'include'
          }).then(res => res.json()).then(data => {this.setState({val:data.val,loading:false},function(){
              if(data.val){
                 this.setState({emailid : data.emailid});
              }
          })})
         
}
handleChange=(e)=>{
    e.preventDefault() ;
    this.setState({
        [e.target.name] : e.target.value
    })
}
submitform=(e)=>{
    e.preventDefault();
    fetch("http://localhost:2000/register", {
    method: "POST",
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(this.state),
    credentials:'include'
  }).then(res => res.json()).then(data => {this.setState({signedup : data},function(){
      if(data === true){
          this.getprofilepage() ;
      }
  })})
}
getprofilepage=()=>{
    // this.props.history.push()
}
componentWillMount(){
   this.getids() ;
}
render() {
    return (
        this.state.loading
        ?
            <div>Loading ....</div>
        :   
            this.state.valid && this.state.val
            ?
            <div className="App container mt-3">
                <h3>
                    Sign Up here {this.state.emailid}
                </h3><br/>
                 <div>
                     <form onSubmit={this.submitform}>
                         <input className='form-control' type="text" name="username" placeholder="Enter Username" onChange={this.handleChange} value={this.state.username} /><br/>
                         <input className='form-control' type="password" name="password" placeholder="Enter password" onChange={this.handleChange} value={this.state.password} /><br/>
                         <button className="btn btn-default addallborder">Sign Up</button>
                     </form>
                 </div>
                {console.log(this.state)}
            </div>                
            :
            <div className="App container mt-3">
                Not a valid link
            </div>
            
    );
  }
}

export default App;
