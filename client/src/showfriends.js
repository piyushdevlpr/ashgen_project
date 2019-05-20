import React, { Component } from 'react';
import socketIOClient from "socket.io-client";
const socket = socketIOClient('http://127.0.0.1:2000', {transports: ['websocket']});

class People extends Component {
    abortController = new AbortController() ;    
    _ismounted = true ;
    constructor(props){
        super(props) ;
        this.state = {
            friendsnewmessage:[],
            friends : [],
            tochatwith : '',
            message : '',
            previousmess : [{from:'',message:''}],
            file: null
        }
        this.handlechange=this.handlechange.bind(this);
        this.sendmsg=this.sendmsg.bind(this);
        this.filehandleChange = this.filehandleChange.bind(this);  //function for file in chat
    }
    updatecount=()=>{
        var data = {friend : this.state.tochatwith , number: this.state.friendsnewmessage[this.state.tochatwith]} ;
        fetch("http://localhost:2000/update-new-message-number", {
            signal:this.abortController.signal,
            method: "POST",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            credentials:'include',
            body:JSON.stringify(data)
          }).then(res=>res.json()).then(data=> {if(this._ismounted === true){console.log(data)}})
          .catch(err=> {
              if(err.name === 'AbortError') return
              throw err
          })
    }
    componentWillUnmount(){
        // this._ismounted = false ;
        this.abortController.abort() ;
        // socket.leave()
    }
    handlechange=(event)=>{
        event.preventDefault();
        this.setState({
            message:event.target.value
        })
    }
    getfriends=()=>{
        fetch("http://localhost:2000/get-friends", {
            signal:this.abortController.signal,
            method: "GET",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            credentials:'include'
          }).then(res => res.json()).then(data => {if(this._ismounted === true){this.setState({friends:data},function(){
            
            var map = this.state.friendsnewmessage;  
            for(var i = 0 ; i < this.state.friends.length ; i++){
                map[this.state.friends[i].name] = this.state.friends[i].newmess ;
              }
              this.setState({friendsnewmessage : map},function(){
                console.log(this.state) ;
              })
          })}}).catch(err=> {
            if(err.name === 'AbortError') return
            throw err
        })
    }
    getsockethere=()=>{

        if(this.state.previousmess.length === 0){
            socket.emit("showmessages",{username:this.props.location.state.username, friendname:this.state.tochatwith}) ;
        }
        socket.on("getmessages",data=>{ this.setState({previousmess:data.messages})})
    }
    // allonsockets=()=>{
    //     socket.on("getmessages",data=>{ this.setState({previousmess:data.messages})}); 
    //     socket.on("newmessagereceived",data=>{
    //         this.setState(state => {
    //             const list = state.previousmess.slice();
    //             list.push(data.messages);
    //             console.log(data.messages) ;
    //             return {
    //               previousmess:list
    //             };
    //           });
    //         }
    //         );
    //     // this.setState({previousmess:this.state.previousmess.push(data.messages)})});
    // }
    getmetochat=(friend_name)=>{
        var list = this.state.friendsnewmessage ;
        list[friend_name] = 0 ;
        this.setState({tochatwith : friend_name , previousmess:[],friendsnewmessage:list},function(){
            this.getsockethere() ;
            this.updatecount() ;
        }) ;
    }
    showfriends=()=>{
        const list = this.state.friends.map((data,index)=>
            <li><span>{data.name}</span><button onClick={()=>this.getmetochat(data.name)}>message</button><span>{this.state.friendsnewmessage[data.name] ? (<span> {this.state.friendsnewmessage[data.name]}  message received </span>): null}</span></li>
        );
        return list ;
    }

    filehandleChange(event)
    {
        event.preventDefault();
        this.setState({[event.target.name]: event.target.files[0]},
            ()=>{console.log(this.state.file)}
            
            );
        

    }

    sendmsg=(event)=>{
        event.preventDefault() ;
        if(this.state.file==null)
        {
            var msg = this.state.message ;
            var file= this.state.file;     // only for checking at server if this is null
            this.setState({message : ""},function(){
                socket.emit("newmessage",{username:this.props.location.state.username,friendname:this.state.tochatwith ,message:msg,file:file}) ;
            });

        }
        else{
            var msg = this.state.message ;
            var file= this.state.file;
            var fileName= file.name;
            var fileType = file.type.split('/')[0];
            //var socket = socketIOClient('http://127.0.0.1:2000', {transports: ['websocket']});
            this.setState({message : ""},function(){
                socket.emit("newmessage",{username:this.props.location.state.username,friendname:this.state.tochatwith ,message:msg,file:this.state.file,fileName,fileType}) ;
            }); 

        }
     
        this.mainInput.value = "";
    }
    showpreviousmessages=()=>{        
        const list = this.state.previousmess.map((data,index)=>
            <li>{data.from} : {data.data.message}</li>
            ); 
            return list ;
    }
    componentWillMount(){ 
        // this._ismounted = true ;     
        this.getfriends() ;
        this.showfriends() ;
        socket.emit('join',{username:this.props.location.state.username}) ;
        socket.on("newmessagereceived",data=>{
            this.setState(state => {
                // if(data.message.from !== this.state.tochatwith && data.message.from === this.props.location.state.username){
                //     return ;
                // }
                if(data.messages.from !== this.state.tochatwith && data.messages.from !== this.props.location.state.username){
                    var list2 = this.state.friendsnewmessage ;
                    list2[data.messages.from]++ ;
                    return {
                        friendsnewmessage:list2
                    };  
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
                            <div className="form-group">
                        <label for="exampleFormControlFile1">Choose File</label>
                        <input type="file" name="file" onChange={this.filehandleChange} className="form-control-file" id="exampleFormControlFile1" />
                         </div>
                        </form>
                     
                        </div>
                    </div>    
                    )
                    : null }
                    </div>
                    {console.log(this.state)}
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