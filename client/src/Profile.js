import React, { Component } from 'react';
import socketIOClient from "socket.io-client";
const axios = require("axios");


export default class Profile extends Component{
    constructor(props){
        super(props) ;
        this.state = {
            username : this.props.location.state.username ,
            team : 'set'
        }
    }
    getProfile=()=>{
        fetch("http://localhost:2000/getprofile",{
        // fetch("https://ojus-server-132kgu2rdjqbfc.herokuapp.com/getprofile",{
            method: "GET",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            credentials:'include'
          }).then(res => res.json()).then(data => {
              console.log(data);
              this.setState({team:data.team},function(){
              console.log(this.state)
          })})
    }
    componentDidMount(){
        this.getProfile() ;
    }
    render()
    {
        return(
            this.state.team === 'set' 
            ?
            (
                null 
            )
            :(this.state.team === true) ?
            (
                <div>
                    team
                </div>
            )
            :(this.state.team === false)?
            (
                <div>
                    ind
                </div>
            ):null
        );
    }
}