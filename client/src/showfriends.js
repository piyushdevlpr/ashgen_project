import React, { Component } from 'react';
import socketIOClient from "socket.io-client";
const socket = socketIOClient('http://127.0.0.1:2000', {transports: ['websocket']});
        
class People extends Component {
    
    ismounted = true ;
    constructor(props){
        super(props) ;
        this.state = {
            friends : [],
            tochatwith : '',
            message : '',
            previousmess : [{from:'',message:''}]
        }
        this.handlechange=this.handlechange.bind(this);
        this.sendmsg=this.sendmsg.bind(this);
    }
    handlechange=(event)=>{
        event.preventDefault();
        this.setState({
            message:event.target.value
        })
    }
    getfriends=()=>{
        fetch("http://localhost:2000/get-friends", {
            method: "GET",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            credentials:'include'
          }).then(res => res.json()).then(data => {if(this.ismounted === true){this.setState({friends:data})}})
          console.log(this.state) ;
    }
    getsockethere=()=>{

        if(this.state.previousmess.length === 0){
            socket.emit("showmessages",{username:this.props.location.state.username, friendname:this.state.tochatwith}) ;
        }
        socket.on("getmessages",data=>{ this.setState({previousmess:data.messages})})
    }
    allonsockets=()=>{
        socket.on("getmessages",data=>{ this.setState({previousmess:data.messages})}); 
        socket.on("newmessagereceived",data=>{
            this.setState(state => {
                const list = state.previousmess.slice();
                list.push(data.messages);
                console.log(data.messages) ;
                return {
                  previousmess:list
                };
              });
            }
            );
        // this.setState({previousmess:this.state.previousmess.push(data.messages)})});
    }
    getmetochat=(friend_name)=>{
        this.setState({tochatwith : friend_name , previousmess:[]},function(){this.getsockethere()}) ;
    }
    showfriends=()=>{
        const list = this.state.friends.map((data,index)=>
            <li><span>{data.name}</span><button onClick={()=>this.getmetochat(data.name)}>message</button></li>
        );
        return list ;
    }
    sendmsg=(event)=>{
        event.preventDefault() ;
        var msg = this.state.message ;
        //var socket = socketIOClient('http://127.0.0.1:2000', {transports: ['websocket']});
        this.setState({message : ""},function(){
            socket.emit("newmessage",{username:this.props.location.state.username,friendname:this.state.tochatwith , message:msg}) ;
        }); 
        this.mainInput.value = "";
    }
    showpreviousmessages=()=>{        
        const list = this.state.previousmess.map((data,index)=>
            <li>{data.from} : {data.data}</li>
            ); 
            return list ;
    }
    componentDidMount(){ 
        this.ismounted = true ;     
        this.getfriends() ;
        this.showfriends() ;
        socket.emit('join',{username:this.props.location.state.username}) ;
        socket.on("newmessagereceived",data=>{
            this.setState(state => {
                if(data.messages.from !== this.state.tochatwith && data.messages.from !== this.props.location.state.username){
                  return ;  
                }
                const list = state.previousmess.slice();
                list.push(data.messages);
                console.log(data.messages.data) ;
                return {
                  previousmess:list
                };
              });
            }
            );
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
                    <ul className = "list-group mb-1">  {this.showfriends()}</ul>      
                    <div>
                    { this.state.tochatwith ? 
                    (   
                        <div>
                        <h1>Send message to {this.state.tochatwith}</h1>
                        <div>
                        <div style={styles}>
                            {this.showpreviousmessages()}
                            {/* {this.state.previousmess} */}
                        </div>
                        <form onSubmit={this.sendmsg}>
                            <input ref={(ref) => this.mainInput= ref} required={true} placeholder='enter text' type='text' name='message' onChange={this.handlechange} value={this.state.currentmsg}></input>
                            <button >Send</button>
                        </form>
                        </div>
                    </div>    
                    )
                    : null }
                    </div>
                    {console.log(this.state)}
                    {/* {this.allonsockets()} */}
                </div>
            );
        }        
    }
}
var styles = {
	backgroundColor:'#D3D3D3',
    overflow:'scroll',
    height:'350px',
    width:'300px'
};
 

export default People ;