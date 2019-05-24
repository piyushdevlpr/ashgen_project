import React, { Component } from 'react';
import './App.css';
import GetGroup from './GetGroup';
import ChatText from './ChatText';
import ChatPhoto from './ChatPhoto';
import ChatVideo from './ChatVideo';
import socketIOClient from "socket.io-client";
const socket = socketIOClient('http://127.0.0.1:2000', {transports: ['websocket']});
        
class People extends Component {
    
    ismounted = true ;
    constructor(props){
        super(props) ;
        this.state = {
            name: this.props.location.state.username,
            friendsnewmessage:[],
            creating : false ,
            showDone : false ,
            tochatwith: '',
            tochatwithid: '',           // groupid of group to be messaged
            previousgroupid:'',         //group id of previously opened group
            toshowgroupid:'',
            toshowgroupname:'', 
            groupusers : [],
            grouprequestedusers : [],
            admin:'',
            members : [],
            newgroupname : '',
            groups:[],
            friends: [],
            previousmess:[],
            file: null

        }
        this.handlechange = this.handlechange.bind(this);
        this.getCreating = this.getCreating.bind(this);
        this.creategroup = this.creategroup.bind(this);
        this.sendmsg = this.sendmsg.bind(this);
        this.getGroupInfo = this.getGroupInfo.bind(this);
        this.filehandleChange = this.filehandleChange.bind(this);  //function for file in chat

    }
    getCreating=(event)=>{
        event.preventDefault();
        this.setState({
            creating : !this.state.creating,
            members : [],
            tochatwith : '',
            tochatwithid: '',
            toshowgroupid:'',
            toshowgroupname:''
        })
    }
    updatecount=()=>{
        var data = {groupid : this.state.tochatwithid , number: this.state.friendsnewmessage[this.state.tochatwithid]} ;
        fetch("http://localhost:2000/update-new-message-number-group", {
            // signal:this.abortController.signal,
            method: "POST",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            credentials:'include',
            body:JSON.stringify(data)
          }).then(res=>res.json()).then(data=> {if(this._ismounted === true){console.log(data)}})
          .catch(err=> {
            //   if(err.name === 'AbortError') return
              throw err
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
              this.setState({creating :false , groups : data},function(){
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
            socket.emit("showgroupmessages",{groupname:this.state.tochatwith, groupid:this.state.tochatwithid, username : this.props.location.state.username}) ;
            socket.emit("leave-socket-of-group",{groupid:this.state.previousgroupid})
            socket.emit("joingroup",{groupid:this.state.tochatwithid})
        }
        socket.on("getgroupmessages",data=>{ this.setState({previousmess:data.messages})})
    }
    getmetochat=(friend_name)=>{        // set groupname with whom u have to chat as tochatwith and its id and then call getsockethere to get chat history
        var list = this.state.friendsnewmessage ;
        list[friend_name.groupid] = 0 ;
        this.setState({previousgroupid : this.state.tochatwithid,friendsnewmessage:list},function(){
            this.setState({tochatwith : friend_name.groupname ,tochatwithid:friend_name.groupid, previousmess:[]},function(){
                this.getsockethere()
                this.updatecount() ;
            }) ;
        }) ;
    }
    getgroups=()=>{
        fetch("http://localhost:2000/get-groups", {
            method: "GET",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            credentials:'include'
          }).then(res => res.json()).then(data => {if(this.ismounted === true){
              this.setState({groups:data.sort(function(m1,m2){return m2.lastUpdatedAt - m1.lastUpdatedAt})},function(){
                var map = this.state.friendsnewmessage;  
                for(var i = 0 ; i < this.state.groups.length ; i++){
                    map[this.state.groups[i].groupid] = this.state.groups[i].newmess ;
                  }
                  this.setState({friendsnewmessage : map},function(){
                    console.log(this.state) ;
                  })
              })}})
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
    getgroupfromdb=()=>{
        fetch("http://localhost:2000/getgroup/"+this.state.toshowgroupid, {
            method: "GET",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            credentials:'include'
          }).then(res => res.json()).then(data => {
              this.setState({groupusers:data.users , grouprequestedusers:data.requestedusers,admin:data.admin},function(){
                console.log(this.state) ;
              })})
    }
    getGroupInfo=(group)=>{
        this.setState({tochatwith:'',tochatwithid:'',toshowgroupid:group.groupid,toshowgroupname:group.groupname},function(){
            console.log(group);         
            this.getgroupfromdb() ;   
        })
    }
    showgroups=()=>{
        const list = this.state.groups.map((data,index)=>
            <li><span onClick={()=>this.getGroupInfo(data)}>{data.groupname}</span><button onClick={()=>this.getmetochat(data)}>message</button><span>{this.state.friendsnewmessage[data.groupid] ? (<span> {this.state.friendsnewmessage[data.groupid]}  message received </span>): null}</span></li>
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
        socket.emit("join",{username : this.props.location.state.username}) ;
        socket.on("newgroupmessagereceived",data=>{
            this.setState(state => {
                const list = state.previousmess.slice();
                list.push(data.messages);
                console.log(data.messages.data) ;
                return {
                  previousmess:list
                };
              });
            }
            );
        socket.on("newnotification",data=>{  
            this.setState(state => {

                    var list2 = this.state.friendsnewmessage ;
                    if(this.state.tochatwithid !== data.groupid && data.from !== this.props.location.state.username){  // if current group is not opened nor is the user the sender of the message,  increment the message number
                    list2[data.groupid]++ ;
                    }
                    var x = {} ;
                    var z = []
                    z = this.state.groups ;
                    for(var i = 0 ; i < z.length ; i++){
                        if(z[i].groupid == data.groupid){
                            x = z[i] ;
                            z.splice(i,1) ;
                            break ;
                        }
                    }
                    z.unshift(x) ;
                    return {
                      friendsnewmessage:list2 , groups : z
                    };
                  });
                
                });
        
    }
    showpreviousmessages=()=>{        
        const list = this.state.previousmess.map((data,index)=>
        {
            if(data.data.format=="text") 
            {   
               return( <ChatText key={index} data={data} />)

            }
            else if(data.data.format=="image")
            {
                return (<ChatPhoto key={index} data={data} />)
            }
            else if(data.data.format=="video")
            {
                return(<ChatVideo key={index} data={data} />)
            }
        }
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
            var file = this.state.file;   // only for checking at server if this is null
            //var socket = socketIOClient('http://127.0.0.1:2000', {transports: ['websocket']});
            this.setState({message : ""},function(){
                socket.emit("newgroupmessage",{username:this.props.location.state.username,groupid:this.state.tochatwithid , message:msg, file:file}) ;
            }); 

        }
        else{
            var msg = this.state.message ;
            var file = this.state.file;   // only for checking at server if this is null
            var fileName= file.name;
            var fileType = file.type.split('/')[0];
            //var socket = socketIOClient('http://127.0.0.1:2000', {transports: ['websocket']});
            this.setState({message : ""},function(){
                socket.emit("newgroupmessage",{username:this.props.location.state.username,groupid:this.state.tochatwithid , message:msg,file:this.state.file,fileName,fileType}) ;
            }); 

        }
     
        this.mainInput.value = "";
    }
    removeMemberToUpdateGroup=(data)=>{
        fetch("http://localhost:2000/update-group-removemember/"+this.state.toshowgroupid, {
            method: "POST",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            credentials:'include',
            body: JSON.stringify(data)
          }).then(res => res.json()).then(data => {
              this.setState({groupusers:data.users , grouprequestedusers:data.requestedusers},function(){
                console.log(this.state) ;
              })})
    }
    addMemberToUpdateGroup=(data)=>{
        fetch("http://localhost:2000/update-group-addmember/"+this.state.toshowgroupid, {
            method: "POST",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            credentials:'include',
            body: JSON.stringify(data)
          }).then(res => res.json()).then(data => {
              this.setState({groupusers:data.users , grouprequestedusers:data.requestedusers},function(){
                console.log(this.state) ;
              })})
    }
    // to show group members on click of a group name 
    showmembers=()=>{
        if(this.state.groupinfo !== {}){
        const list = this.state.groupusers.map((data,index)=>
            <div>
                {(data.username === this.props.location.state.username && this.state.admin === this.props.location.state.username) 
                ?
                (<li>you - admin</li>
                ):((data.username === this.props.location.state.username && this.state.admin !== this.props.location.state.username) 
                ? <li>you</li>
                :((data.username !== this.props.location.state.username && this.state.admin === this.props.location.state.username) 
                ? <li>{data.username} <button onClick={()=>this.removeMemberToUpdateGroup(data)}>Remove</button></li>
                :((data.username !== this.props.location.state.username && this.state.admin !== this.props.location.state.username) 
                ? ((data.username === this.state.admin)? <li>{data.username} - admin</li>:<li>{data.username}</li>)
                : null
                )))
                }
            </div>
              );
        return list ; 
        }
        return null ;
    }
    // to show add for friends who are not a member nor requested members
    authuser=(data,result,result2)=>{
        if(result[data.name] === 1 || result2[data.name] === 1){
            return null ;
        }else{
            if(this.props.location.state.username === this.state.admin){
            return (
            <li>    {data.name}  <button onClick={()=>this.addMemberToUpdateGroup(data)}>add</button></li>
            );
            }
        }
    }
    showfriendstoaddingroup=()=>{
        var result = this.state.groupusers.reduce(function(map, obj) {
            map[obj.username] = 1;
            return map;
        }, {}); 
        var result2 = this.state.grouprequestedusers.reduce(function(map, obj) {
            map[obj.username] = 1;
            return map;
        }, {}); 
        console.log(result) ;
        console.log(result2) ;
        const list = this.state.friends.map((data,index)=>
            this.authuser(data,result,result2) 
        );
        return list ; 
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
                            <div className="form-group">
                        <label for="exampleFormControlFile1">Choose File</label>
                        <input type="file" name="file" onChange={this.filehandleChange} className="form-control-file" id="exampleFormControlFile1" />
                         </div>
                        </form>
                        </div>
                    </div>    
                    )
                    : (this.state.toshowgroupid ? 
                    <div>
                        <h3>{this.state.toshowgroupname} - Information</h3>
                        <ul>
                        {this.showmembers()}
                        {this.showfriendstoaddingroup()}
                        </ul>
                    </div>
                    : null) }
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