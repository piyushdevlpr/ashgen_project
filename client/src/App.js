import React, { Component } from 'react';
import './App.css';

class App extends Component {
   _ismounted = true ;
  constructor(props){
    super(props);
    this.state = {
      name : "ppiyush"
    }
}
clicklogin=()=>{
  this.props.history.push('/login/') ;  
}
clicksignup=()=>{
  this.props.history.push('/signup/') ;
}
render() {
    return (
      <div className="App container mt-3">
      <div>
        <button onClick={()=>this.clicklogin()}>LOGIN</button>
        <button onClick={()=>this.clicksignup()}>SIGNUP</button>
      </div>
       </div>
    );
  }
}

export default App;
