import React, { Component } from 'react';
import socketIOClient from "socket.io-client";

class People extends Component {
    ismounted = true ;
    constructor(props){
        super(props) ;
        this.state = {
            people : '',
            user : [],
            friends : [],
            peoplewithnotis : []
        }
        this.handlechange = this.handlechange.bind(this) ;
    }
    sendnoti=(key)=>{
        //event.preventDefault();
        console.log(key) ;
        fetch("http://localhost:2000/notification/"+key, {
            method: "GET",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            credentials:'include'
          }).then(res => res.json()).then(data => {
              console.log(data);
              var list = this.state.peoplewithnotis ;
              list[data.friendname] = 1 ;
            this.setState({peoplewithnotis : list},function(){
                console.log(this.state) ;
            })})
    }
    handlechange=(event)=>{
        event.preventDefault();
        this.setState({
            [event.target.name]:event.target.value
         },function(){
            this.fetchdetails() ;
         })
    }
    fetchdetails=()=>{
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
            user : datas
          })
          console.log(this.state.people) ;
          console.log(this.state.user) ;
        }
        )
        .catch(error => console.log(error));
    }
    authuser=(key)=>{
        if(key.user === this.props.location.state.username){
            return null ;
        }else if(this.state.friends[key.user] != null){
            return(
                <span>{key.user}</span>
            );
        }else if(this.state.peoplewithnotis[key.user] === 1){
            return(
                <span>{key.user}    sent</span>
            );
        }else{
            return(
                <span>{key.user}<button onClick={()=>this.sendnoti(key.user)}>AddFriend</button></span>
            );
        }
    }
    showusers=()=>{
        if(this.state.user.length === 0){
            return (
                <div>
                    NO SUCH USER
                </div>
            );
        }else{
        return(
        this.state.user.map((name,key)=>
            <div>
                {this.authuser(name)} 
            </div>
        )
        );
        }
    }
    getfriends=()=>{
        fetch("http://localhost:2000/get-friends", {
            method: "GET",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            credentials:'include'
          }).then(res => res.json()).then(data => {if(this.ismounted === true){
            var result = data.reduce(function(map, obj) {
                map[obj.name] = obj.propic;
                return map;
            }, {}); 
            this.setState({friends:result},function(){console.log(this.state) })}
            }
            )
    }
    getpeoplewithnotis=()=>{
        fetch("http://localhost:2000/get-notis", {
            method: "GET",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            credentials:'include'
          }).then(res => res.json()).then(data => {if(this.ismounted === true){
            var result = data.reduce(function(map, obj) {
                map[obj.to] = 1;
                return map;
            }, {}); 
            this.setState({peoplewithnotis:result},function(){console.log(this.state) })}
            }
            )
    }
    componentDidMount(){ 
        this.ismounted = true ;     
        this.getfriends() ;
        this.getpeoplewithnotis() ; // get lsit of people u have already sent a request
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