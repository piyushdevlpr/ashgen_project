import React, { Component } from 'react';
import './App.css';
import socketIOClient from "socket.io-client";
const socket = socketIOClient('http://127.0.0.1:2000', {transports: ['websocket']});
        
class People extends Component {
    
    ismounted = true ;
    constructor(props){
        super(props) ;
        this.state = {
            name: this.props.location.state.username,
            creating : false ,
            showDone : false ,
            tochatwith: '',
            tochatwithid: '',           // groupid of group to be messaged
            members : [],
            newgroupname : '',
            output : '',
            groups:[],
            friends: [],
            previousmess:[]
        }
        this.handlechange = this.handlechange.bind(this);
        this.getCreating = this.getCreating.bind(this);
        this.creategroup = this.creategroup.bind(this);
    }
    getCreating=(event)=>{
        event.preventDefault();
        this.setState({
            creating : true,
            tochatwith : '',
            tochatwithid: ''
        })
    }
    creategroup=(event)=>{
        event.preventDefault();
        fetch("http://localhost:2000/newgroup",{
            method: "POST",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(this.state),
            credentials:'include'
          }).then(res => res.json()).then(data => {
              console.log(data);
              this.setState({output : data.mes, creating :false},function(){
            //   this.getgroups() ;
            console.log(this.state)
          })})
          console.log(this.state) ;   
    }
    handlechange=(event)=>{
        event.preventDefault();
        this.setState({
            [event.target.name]:event.target.value
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
    getsockethere=()=>{                       // on click of message button for any group call this to get chat history and listen for new messages

        if(this.state.previousmess.length === 0){
            socket.emit("showgroupmessages",{groupname:this.state.tochatwith, groupid:this.state.tochatwithid}) ;
        }
        socket.on("getgroupmessages",data=>{ this.setState({previousmess:data.messages})})
    }
    getmetochat=(friend_name)=>{        // set groupname with whom u have to chat as tochatwith and its id and then call getsockethere to get chat history
        this.setState({tochatwith : friend_name.groupname ,tochatwithid:friend_name.groupid, previousmess:[]},function(){this.getsockethere()}) ;
    }
    getgroups=()=>{
        fetch("http://localhost:2000/get-groups", {
            method: "GET",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            credentials:'include'
          }).then(res => res.json()).then(data => {if(this.ismounted === true){this.setState({groups:data})}})
          console.log(this.state) ;
    }
    addasmember=(member)=>{
        var li = this.state.members ;
        var tobepushed = {'username':member}
        li.push(tobepushed) ;
        var x = li.length ;
        this.setState({
            members:li
        },function(){
            if(x > 0){
                this.setState({
                    showDone : true 
                })
            }
        })
    }
    showgroups=()=>{
        const list = this.state.groups.map((data,index)=>
            <li><span>{data.groupname}</span><button onClick={()=>this.getmetochat(data)}>message</button></li>
        );
        return list ;
    }
    showfriends=()=>{
        var c = 0
        const list = this.state.friends.map((data,index)=>
            <li>
                {console.log(c++)}
                <span>{data.name}</span>
                <input type="checkbox" id={"demo" + c} />
                <label htmlFor={"demo" + c} onClick={()=>this.addasmember(data.name)}> 
                         add
                    {/* <button onClick={()=>this.addasmember(data.name)}/> */}
                </label>
            </li>
        );
        return list ;
    }
    componentDidMount(){
        this.getgroups() ;
        this.getfriends() ;
    }
    render(){
        if(this.props.location.state === undefined){
            this.props.history.push("/") ;
            return null ;
        }else{
            return(
                <div>
                    <div> 
                        YOUR GROUPs :
                        <button onClick={this.getCreating}>create</button>
                    </div>
                    {this.state.creating ? 
                    (
                        <div>
                            <form>
                            {this.state.showDone ? <button onClick={this.creategroup}>Done</button> : null }
                                Name of group : <input required={true} value={this.state.newgroupchange} onChange={this.handlechange} name = "newgroupname" />
                            </form>
                            <ul>
                                {this.showfriends()}
                            </ul>
                        </div>
                    )
                    : 
                    (<ul className = "list-group mb-1">  {this.showgroups()}</ul>)      
                    }          
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