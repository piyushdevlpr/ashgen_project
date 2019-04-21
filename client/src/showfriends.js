import React, { Component } from 'react';
import socketIOClient from "socket.io-client";

class People extends Component {
    ismounted = true ;
    constructor(props){
        super(props) ;
        this.state = {
            friends : []
        }
    }
    getfriends=()=>{
        fetch("http://localhost:2000/get-friends", {
            method: "GET",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            credentials:'include'
          }).then(res => res.json()).then(data => {if(this.ismounted === true){this.setState({friends:data})}})
          console.log(this.state) ;
    }
    showfriends=()=>{
        return this.state.friends.map((data,index)=>
            <li>{data.name}</li>
        );
    }
    componentDidMount(){ 
        this.ismounted = true ;     
        this.getfriends() ;
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
                        YOUR FRIENDS :
                    </div>                
                    {this.showfriends()}
                    {console.log(this.state)}
                </div>
            );
        }        
    }
}
export default People ;