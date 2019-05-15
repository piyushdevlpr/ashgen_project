import React, { Component } from 'react';
import socketIOClient from "socket.io-client";

class People extends Component {
    ismounted = true ;
    constructor(props){
        super(props) ;
        this.state = {
            messagefrom : [],
            requestfrom : [],
            grouprequest : []
        }
    }
    getnoti=()=>{
        fetch("http://localhost:2000/get-notifications", {
            method: "GET",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            credentials:'include'
          }).then(res => res.json()).then(data => {if(this.ismounted === true){this.setState({messagefrom:data.message , requestfrom: data.request, grouprequest: data.groups})}})
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
          }).then(res => res.json()).then(data => {if(this.ismounted === true){this.setState({messagefrom:[] , requestfrom: [] , grouprequest:[]})}})
    }
    groupdeclined=(key)=>{
        fetch("http://localhost:2000/verdict-groupdeclined", {
            method: "POST",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            credentials:'include',
            body:JSON.stringify(key)
          }).then(res => res.json()).then(data => {if(this.ismounted === true){this.setState({messagefrom:[] , requestfrom: [] , grouprequest:[]})}})    
    }
    accepted=(key)=>{
        fetch("http://localhost:2000/verdict-accepted/"+key, {
            method: "GET",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            credentials:'include'
          }).then(res => res.json()).then(data => {if(this.ismounted === true){this.setState({messagefrom:[] , requestfrom: [] , grouprequest:[]})}})
    }
    declined=(key)=>{
        fetch("http://localhost:2000/verdict-declined/"+key, {
            method: "GET",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            credentials:'include'
          }).then(res => res.json()).then(data => {if(this.ismounted === true){this.setState({messagefrom:[] , requestfrom: [] , grouprequest:[]})}})    
    }
    showmessandreq=()=>{
        if(this.state.messagefrom.length === 0 && this.state.requestfrom.length === 0 && this.state.grouprequest.length === 0){
            return (
                <div>
                No notifications yet !!
                </div>
            );
        }else{
            const groupreq = this.state.grouprequest.map((data)=>
                    <li>
                      <span>You have a new request from {data.from} to join {data.groupname} .</span>
                      <button onClick = {()=>this.groupaccepted(data)}>Accept</button>
                      <button onClick = {()=>this.groupdeclined(data)}>Decline</button> 
                    </li>
            )
            const reqfrom = this.state.requestfrom.map((data)=>
                    <li>
                      <span>You have a friend request from {data} .</span>
                      <button onClick = {()=>this.accepted(data)}>Accept</button>
                      <button onClick = {()=>this.declined(data)}>Decline</button> 
                    </li>
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