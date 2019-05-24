import React, { Component } from 'react';
import socketIOClient from "socket.io-client";

class People extends Component {
    ismounted = true ;
    constructor(props){
        super(props) ;
        this.state = {
            messagefrom : [],
            requestfrom : [],
            grouprequest : [],
            teamrequests : [],
            responded : []
        }
    }
    getnoti=()=>{
        fetch("http://localhost:2000/get-notifications", {
            method: "GET",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            credentials:'include'
          }).then(res => res.json()).then(data => {if(this.ismounted === true){
            this.setState({messagefrom:data.message , requestfrom: data.request, grouprequest: data.groups , teamrequests : data.teamrequests})}})
          console.log(this.state) ;
    }
    componentDidMount(){ 
        this.ismounted = true ;     
        this.getnoti() ;
    }
    componentWillUnmount(){
        this.ismounted = false ; 
    }
    groupaccepted=(key)=>{
        fetch("http://localhost:2000/verdict-groupaccepted", {
            method: "POST",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            credentials:'include',
            body : JSON.stringify(key)
          }).then(res => res.json()).then(data => {if(data.verdict === 'success'){
            var list = this.state.responded ;
            list[key.groupid] = key.groupname ;
            this.setState({responded : list})}})
    }
    groupdeclined=(key)=>{
        fetch("http://localhost:2000/verdict-groupdeclined", {
            method: "POST",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            credentials:'include',
            body:JSON.stringify(key)
          }).then(res => res.json()).then(data => {if(data.verdict === 'success'){
            var list = this.state.responded ;
            list[key.groupid] = key.groupname ;
            this.setState({responded : list})}})
       }
    accepted=(key)=>{
        fetch("http://localhost:2000/verdict-accepted/"+key, {
            method: "GET",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            credentials:'include'
          }).then(res => res.json()).then(data => {if(data.verdict === "success"){
            var list = this.state.responded ;
            list[key]=1 ;
            this.setState({responded : list})}})
    }
    declined=(key)=>{
        fetch("http://localhost:2000/verdict-declined/"+key, {
            method: "GET",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            credentials:'include'
          }).then(res => res.json()).then(data => {if(data.verdict === "success"){
            var list = this.state.responded ;
            list[key]=1 ;
            this.setState({responded : list})}})
    }
    teamaccepted=(key)=>{
        fetch("http://localhost:2000/verdict-team-accepted/"+key.team, {
            method: "GET",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            credentials:'include'
          }).then(res => res.json()).then(data => {if(data.verdict === "success"){
            var list = this.state.responded ;
            list[key.team+'team']=1 ;
            this.setState({responded : list})}})
    }
    teamdeclined=(key)=>{
        fetch("http://localhost:2000/verdict-team-declined/"+key.team, {
            method: "GET",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            credentials:'include'
          }).then(res => res.json()).then(data => {if(data.verdict === "success"){
            var list = this.state.responded ;
            list[key.team+'team']=1 ;
            this.setState({responded : list})}})
    }
    authuser=(data)=>{
       if(this.state.responded[data.groupid] !== data.groupname){
            return (<li>
              <span>You have a new request from {data.from} to join {data.groupname} .</span>
              <button onClick = {()=>this.groupaccepted(data)}>Accept</button>
              <button onClick = {()=>this.groupdeclined(data)}>Decline</button> 
            </li>
            );
       }
    }
    authuser2=(data)=>{
        if(this.state.responded[data] !== 1){
             return (<li>
                <span>You have a friend request from {data} .</span>
                <button onClick = {()=>this.accepted(data)}>Accept</button>
                <button onClick = {()=>this.declined(data)}>Decline</button> 
              </li>)
        }
     }
     authuser3=(data)=>{
        if(this.state.responded[data.team+'team'] !== 1){
             return (<li>
                <span>You have a request to join team {data.team} .</span>
                <button onClick = {()=>this.teamaccepted(data)}>Accept</button>
                <button onClick = {()=>this.teamdeclined(data)}>Decline</button> 
              </li>)
        }
     }
    showmessandreq=()=>{
        if((this.state.messagefrom.length === 0 && this.state.requestfrom.length === 0 && this.state.teamrequests.length === 0 && this.state.grouprequest.length === 0) || (this.state.responded.length === (this.state.messagefrom.length + this.state.requestfrom.length + this.state.grouprequest.length + this.state.teamrequests.length))){
            return (
                <div>
                No notifications yet !!
                </div>
            );
        }else{
            const groupreq = this.state.grouprequest.map((data)=>
                    this.authuser(data)
            )
            const reqfrom = this.state.requestfrom.map((data)=>
                    this.authuser2(data) 
            )
            const teamfrom = this.state.teamrequests.map((data)=>
                    this.authuser3(data) 
            )
            const messfrom = this.state.messagefrom.map((data,key)=>
             <div>
                You have a new message from {data} .
            </div>
            )
            return (
            <div> 
               <ul>
                    {groupreq}
                </ul>
               <ul>
                    {reqfrom}
                </ul>
                <ul>
                    {messfrom}
                </ul>
                <ul>
                    {teamfrom}
                </ul>
            </div>
            ) ;
        }
    }
    render(){
        if(this.props.location.state === undefined){
            this.props.history.push("/") ;
            return null ;
        }else{
            return(
                <div>
                    <div>
                        NOTIFICATIONS :
                    </div>
                    {this.showmessandreq()}
                    {console.log(this.state)}
                </div>
            );
        }        
    }
}
export default People ;