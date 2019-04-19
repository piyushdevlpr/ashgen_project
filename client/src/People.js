import React, { Component } from 'react';
import socketIOClient from "socket.io-client";

class People extends Component {
    ismounted = true ;
    constructor(props){
        super(props) ;
        this.state = {
            people : '',
            propiclink : [],
            username : []
        }
        this.handlechange = this.handlechange.bind(this) ;
        // this.sendnoti = this.sendnoti.bind(this) ;
    }
    sendnoti=(key)=>{
        //event.preventDefault();
        console.log(key) ;
        fetch("http://localhost:2000/notification/"+key, {
            method: "GET",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            credentials:'include'
          }).then(res => res.json()).then(data => {if(this._ismounted === true){this.setState({signedup : data})}})
          console.log(this.state) ;
        
    }
    handlechange=(event)=>{
        event.preventDefault();
        this.setState({
            [event.target.name]:event.target.value
         })
         this.fetchdetails() ;
    }
    fetchdetails=()=>{
        //events.preventDefault();
        if(this.state.people === undefined){
            this.setState({
                people:''
            });
        }
        fetch("http://localhost:2000/people/"+this.state.people)    
        .then(response => response.json())
        .then(datas =>{
          this.setState({
            //propiclink: datas.propic,
            username : datas.users
          })
          console.log(this.state.people) ;
          console.log(this.state.username) ;
        }
        )
        .catch(error => console.log(error));
    }
    authuser=(key)=>{
        if(key === this.props.location.state.username){
            return null ;
        }else{
            return(
                <span>{key}<button onClick={()=>this.sendnoti(key)}>AddFriend</button></span>
            );
        }
    }
    showusers=()=>{
        if(this.state.username.length === 0){
            return (
                <div>
                    NO SUCH USER
                </div>
            );
        }else{
        return(
        this.state.username.map((name,key)=>
            <div>
                {this.authuser(name)} 
            </div>
        )
        );
        }
    }
    componentDidMount(){ 
        this.ismounted = true ;     
    }
    componentWillUnmount(){
        this.ismounted = false ; 
    }
    render(){
        if(this.props.location.state === undefined){
            this.props.history.push("/") ;
            return null ;
        }else{
            return(
                <div>
                <div>
                    <form>
                        <input placeholder="search" value={this.state.people} onChange={this.handlechange} name = "people"/>
                        {/* <button>Search</button> */}
                    </form>
                </div>
                
                    {this.showusers()}
                
                </div>
            );
        }        
    }
}
export default People ;