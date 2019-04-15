import React, { Component } from 'react';
import socketIOClient from "socket.io-client";

class Chat extends Component {
    ismounted = false ;
    constructor(props){
        super(props) ;
        this.state = {
            response : '',
            endpoint : "http://127.0.0.1:2000",
            username : '' 
        }
    }
    setthestate=data=>{
        if(this.ismounted === true){
        this.setState({response : data}) ;
        console.log(this.state);
        }
    }
    componentDidMount(){ 
        this.ismounted = true ;
        const socket = socketIOClient(this.state.endpoint);
        socket.on("react",this.setthestate);      
        socket.emit("incoming", this.state.username) ; 
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
                    Chat !!!
                    {this.state.response.data}
                    {this.props.location.state.username}
                </div>
            );
        }        
    }
}
export default Chat ;