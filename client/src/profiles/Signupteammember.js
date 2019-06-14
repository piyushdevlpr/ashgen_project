import React, { Component } from 'react';
import axios from 'axios'
import '../App.css';

class App extends Component {
   _ismounted = true ;
  constructor(props){
    super(props);
    this.state = {
        _id:'',
        team:false,
        loading : true,
        emailid : "",
        username:'',
        password:'',
        signedup:null,
        info : null         //all data of schema
    }
    this.submitform = this.submitform.bind(this) ;
    this.handleChange = this.handleChange.bind(this) ; 
    this.getids = this.getids.bind(this);
    this.getinformation = this.getinformation.bind(this);
    this.getForm   = this.getForm.bind(this);
}
getids=()=>{
    console.log(this.props.location.pathname.split('/')[2])
    var id = this.props.location.pathname.split('/')[2] ;
    this.setState({_id:id},()=>{this.getinformation()});
    
     
}
getinformation=()=>{
    const config = {
        headers: {
            'content-type': 'application/json'
        },
        withCredentials: true, // default

    };
   var  data = {"_id":this.state._id}
    axios.post('http://localhost:2000/get-info-requestedmember',data,config)
    .then((response)=>{
        this.setState({loading:false})
        console.log(response);
        this.setState({emailid:response.data.email});
        this.setState({info:response.data});
    })
    .catch((err)=>{throw err})
         
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
      console.log(data);
      if(data == 'true'){
          console.log('BOLLL');
          this.getForm() ;
      }
  })})
}
getForm=()=>{
    // this.props.history.push()
    this.props.history.push({
        pathname:'/member-form/',
        state :{
            username : this.state.username,
            info : this.state.info
        }
      }) ;
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
       
            
    );
  }
}

export default App;
