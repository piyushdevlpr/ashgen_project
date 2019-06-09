import React, { Component } from 'react';
import './App.css';
import ChatText from './ChatText';
import ChatPhoto from './ChatPhoto';
import ChatVideo from './ChatVideo';
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
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
            toshowgroupname:'',
            previousmess:[]
        })
    }
    updatecount=()=>{
        var data = {groupid : this.state.tochatwithid , number: this.state.friendsnewmessage[this.state.tochatwithid]} ;
        fetch("http://localhost:2000/update-new-message-number-group", {
        // fetch(" https://ojus-server-132kgu2rdjqbfc.herokuapp.com/update-new-message-number-group", {
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
        // https://ojus-server-132kgu2rdjqbfc.herokuapp.com/
        fetch("http://localhost:2000/newgroup",{
        // fetch("https://ojus-server-132kgu2rdjqbfc.herokuapp.com/newgroup",{
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
        // https://ojus-server-132kgu2rdjqbfc.herokuapp.com/
        fetch("http://localhost:2000/get-friends", {
        // fetch("https://ojus-server-132kgu2rdjqbfc.herokuapp.com/get-friends", {
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
            this.setState({tochatwith : friend_name.groupname ,tochatwithid:friend_name.groupid, previousmess:[],toshowgroupid:''},function(){
                this.getsockethere()
                this.updatecount() ;
            }) ;
        }) ;
    }
    getgroups=()=>{
        
        fetch("http://localhost:2000/get-groups", {
            // fetch("https://ojus-server-132kgu2rdjqbfc.herokuapp.com/get-groups", {
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
            // fetch("https://ojus-server-132kgu2rdjqbfc.herokuapp.com/getgroup/"+this.state.toshowgroupid, {
        method: "GET",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            credentials:'include'
          }).then(res => res.json()).then(data => {
              this.setState({groupusers:data.users , grouprequestedusers:data.requestedusers,admin:data.admin},function(){
                console.log(this.state) ;
              })})
    }
    getGroupInfo=(group)=>{
        this.setState({tochatwith:'',tochatwithid:'',previousmess:[],toshowgroupid:group.groupid,toshowgroupname:group.groupname},function(){
            console.log(group);         
            this.getgroupfromdb() ;   
        })
    }
    showgroups=()=>{
        const list = this.state.groups.map((data,index)=>
        <li >
        <div class="usr-msg-details">
            <div class="usr-ms-img">
                <img src="images/resources/m-img1.png" alt=""/>
                    {/* <span class="msg-status"></span> */}
            </div>
            <div class="usr-mg-info">
                <h3 onClick={()=>this.getGroupInfo(data)}>{data.groupname}</h3>
            </div>
            <button onClick={()=>this.getmetochat(data)}>message</button>
            {/* <!--usr-mg-info end--> */}
            {/* <span class="posted_time">1:55 PM</span> */}
            <span>{this.state.friendsnewmessage[data.groupid] ? (<span class="msg-notifc"> {this.state.friendsnewmessage[data.groupid]}</span>): null}</span>
        </div>
                                        {/* <!--usr-msg-details end--> */}
    </li>
        //     <div class="chat_list">
    //     <div class="chat_people">
    //       <div class="chat_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"/> 
    //       </div>
    //       <div class="chat_ib">
    //       <h5 onClick={()=>this.getGroupInfo(data)}>{data.groupname}</h5>
    //       <button onClick={()=>this.getmetochat(data)}>message</button>
    //       <span>{this.state.friendsnewmessage[data.groupid] ? (<span> {this.state.friendsnewmessage[data.groupid]}  message received </span>): null}</span> 
    //       </div>         
    //     </div>
    //   </div>
        );
        return list ;
    }
    showfriends=()=>{
        var c = 0
        const list = this.state.friends.map((data,index)=>
        <li >
        <div class="usr-msg-details">
            <div class="usr-ms-img">
                <img src="images/resources/m-img1.png" alt=""/>
                    {/* <span class="msg-status"></span> */}
            </div>
            <div class="usr-mg-info">
                <h3>{data.name}</h3>
                <input type="checkbox" id={"demo" + c} />
                <label htmlFor={"demo" + c++} onClick={()=>this.addasmember(data.name)}> 
                         add
                </label>
            </div>
        </div>                                {/* <!--usr-msg-details end--> */}
        </li>
        
    //     <div class="chat_list">
    //     <div class="chat_people">
    //       <div class="chat_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"/> 
    //       </div>
    //       <div class="chat_ib">
    //       <h5>{data.name}</h5>
    //             <input type="checkbox" id={"demo" + c} />
    //             <label htmlFor={"demo" + c++} onClick={()=>this.addasmember(data.name)}> 
    //                      add
    //             </label>
    //         </div>
    //     </div>
    //   </div>
        );
        return list ;
    }
    componentWillUnmount(){
        // window.removeEventListener('beforeunload',this.doSomethingBeforeUnload());
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
                socket.emit("newmesstozerogrp",{groupid:this.state.tochatwithid,currentuser:this.props.location.state.username});
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
               return( <ChatText key={index} data={data} user={this.props.location.state.username}/>)

            }
            else if(data.data.format=="image")
            {
                return (<ChatPhoto key={index} data={data} user={this.props.location.state.username}/>)
            }
            else if(data.data.format=="video")
            {
                return(<ChatVideo key={index} data={data} user={this.props.location.state.username}/>)
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
        // fetch("https://ojus-server-132kgu2rdjqbfc.herokuapp.com/update-group-removemember/"+this.state.toshowgroupid, {
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
            // fetch("https://ojus-server-132kgu2rdjqbfc.herokuapp.com/update-group-addmember/"+this.state.toshowgroupid, {
        method: "POST",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            credentials:'include',
            body: JSON.stringify(data)
          }).then(res => res.json()).then(data => {
              this.setState({groupusers:data.users , grouprequestedusers:data.requestedusers},function(){
                console.log(this.state) ;
              })})
    }
    delete_group=()=>{
        
        fetch("http://localhost:2000/delete-group/"+this.state.toshowgroupid, {
            // fetch("https://ojus-server-132kgu2rdjqbfc.herokuapp.com/delete-group/"+this.state.toshowgroupid, {
        method: "GET",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            credentials:'include'
          }).then(res => res.json()).then(data =>{ if(data.verd === "success"){
              var groupid = this.state.toshowgroupid ;
              this.setState({tochatwith:'',tochatwithid:'',toshowgroupid:''},function(){
                var gr = this.state.groups ;  
                for(var i = 0 ; i < this.state.groups.length ; i++){
                      if(gr[i].groupid == groupid){
                          gr.splice(i,1) ;
                          break ;
                      }
                  }
                  this.setState({groups:gr},function(){
                    console.log(this.state) ;
                  }) ;
              }
            )}})
    }
    // to show group members on click of a group name 
    componentDidUpdate() {
        if(this.state.tochatwith){
        this.scrollToBottom();
        }
      }
      getEmojiSelector=(e)=>{
        e.preventDefault();
        this.setState({emoji : !this.state.emoji}) ;
    }   
    emojihere=()=>{
        if(this.state.emoji === true){
           return <span className="placeemoji"><Picker onSelect={this.addEmoji} /></span>
        }
    }
    addEmoji = (e) => {
        //console.log(e.unified)
        if (e.unified.length <= 5){
          let emojiPic = String.fromCodePoint(`0x${e.unified}`)
          console.log(emojiPic) ;
          this.setState({
            message: this.state.message + emojiPic
          })
        }else {
          let sym = e.unified.split('-')
          let codesArray = []
          sym.forEach(el => codesArray.push('0x' + el))
          //console.log(codesArray.length)
          //console.log(codesArray)  // ["0x1f3f3", "0xfe0f"]
          let emojiPic = String.fromCodePoint(...codesArray)
          console.log(emojiPic) ;
          this.setState({
            message: this.state.message + emojiPic
          })
        }
      }
    showmembers=()=>{
        if(this.state.groupinfo !== {}){
        const list = this.state.groupusers.map((data,index)=>
        <li className="add-bottom-border">
        <div class="usr-msg-details">
            <div class="usr-ms-img">
                <img src="images/resources/m-img1.png" alt=""/>
            </div>
            <div class="usr-mg-info">
            {(data.username === this.props.location.state.username && this.state.admin === this.props.location.state.username) 
            ?
            (<h3>you - admin</h3>
            ):((data.username === this.props.location.state.username && this.state.admin !== this.props.location.state.username) 
            ? <h3>you</h3>
            :((data.username !== this.props.location.state.username && this.state.admin === this.props.location.state.username) 
            ? <h3>{data.username} <button onClick={()=>this.removeMemberToUpdateGroup(data)}>Remove</button></h3>
            :((data.username !== this.props.location.state.username && this.state.admin !== this.props.location.state.username) 
            ? ((data.username === this.state.admin)? <h3>{data.username} - admin</h3>:<h3>{data.username}</h3>)
   
            : null
            )))
            }
            </div>
        </div>
        </li>


    //     <div class="chat_list">
    //     <div class="chat_people">
    //       <div class="chat_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"/> 
    //       </div>
    //       <div class="chat_ib">
    //       {(data.username === this.props.location.state.username && this.state.admin === this.props.location.state.username) 
    //         ?
    //         (<div className="list-group-item list-group-item-warning">you - admin</div>
    //         ):((data.username === this.props.location.state.username && this.state.admin !== this.props.location.state.username) 
    //         ? <div className="list-group-item list-group-item-warning">you</div>
    //         :((data.username !== this.props.location.state.username && this.state.admin === this.props.location.state.username) 
    //         ? <div className="list-group-item list-group-item-warning">{data.username} <button onClick={()=>this.removeMemberToUpdateGroup(data)}>Remove</button></div>
    //         :((data.username !== this.props.location.state.username && this.state.admin !== this.props.location.state.username) 
    //         ? ((data.username === this.state.admin)? <div>{data.username} - admin</div>:<div className="list-group-item list-group-item-warning">{data.username}</div>)
   
    //         : null
    //         )))
    //         }
    //     </div>
    //     </div>
    //   </div>
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
                // <li className="list-group-item list-group-item-primary">
                //   <h5>{data.name}</h5>
                //   <button onClick={()=>this.addMemberToUpdateGroup(data)}>add</button>
                // </li>
                <li className="add-bottom-border">
			<div class="usr-msg-details">
				<div class="usr-ms-img">
					<img src="images/resources/m-img1.png" alt=""/>
						{/* <span class="msg-status"></span> */}
				</div>
				<div class="usr-mg-info">
				    <h3>{data.name}</h3>
				</div>
                <button onClick={()=>this.addMemberToUpdateGroup(data)}>add</button>
                {/* <!--usr-mg-info end--> */}
				{/* <span class="posted_time">1:55 PM</span> */}
			</div>
                                            {/* <!--usr-msg-details end--> */}
		</li>

                
            //     <div class="chat_list">
            //     <div class="chat_people">
            //       <div class="chat_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"/> 
            //       </div>
            //       <div class="chat_ib">
            //         <h5>{data.name}</h5>
            //         <button onClick={()=>this.addMemberToUpdateGroup(data)}>add</button>
            //         </div>
            //     </div>
            //   </div>
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
    handleClick = (e) => {
        this.inputElement.click();
    }
    scrollToBottom = () => {
        const scrollHeight = this.messageList.scrollHeight;
        const height = this.messageList.clientHeight;
        const maxScrollTop = scrollHeight - height;
        this.messageList.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
}
    render(){
        if(this.props.location.state === undefined){
            this.props.history.push("/") ;
            return null ;
        }else{
            return(
                <div>
                {console.log(this.state)}
<section class="messages-page">
<div class="container">
    <div class="messages-sec">
        <div class="row">
            <div class="col-lg-4 col-md-12 no-pdd">
                <div class="msgs-list">
                    <div class="msg-title">
                    <button onClick={this.getCreating}>create</button>
                        <ul>
                            <li><a href="#" title=""><i class="fa fa-cog"></i></a></li>
                            <li><a href="#" title=""><i class="fa fa-ellipsis-v"></i></a></li>
                        </ul>
                    </div>
                    {/* <!--msg-title end--> */}
                    {this.state.creating ? 
                    (
                        <span>
                            <div className="messages-list">
                            <form>
                            {this.state.showDone ? <button onClick={this.creategroup}>Done</button> : null }
                                GroupName : <input required={true} value={this.state.newgroupchange} onChange={this.handlechange} name = "newgroupname" />
                            </form>
                            </div>
                                <div class="messages-list">
                                    <ul>
                                        {this.showfriends()}
                                    </ul>
                                </div>
                        </span>
                    )    
                    :
                    <div class="messages-list">
                        <ul>
                        {this.showgroups()}
                        </ul>
                    </div>
                    }
                    {/* <!--messages-list end--> */}
                </div>
                {/* <!--msgs-list end--> */}
            </div>
            <div class="col-lg-8 col-md-12 pd-right-none pd-left-none">
                <div class="main-conversation-box">
                    <div class="message-bar-head">
                        <div class="usr-msg-details">
                            <div class="usr-ms-img">
                                <img src="images/resources/m-img1.png" alt=""/>
                            </div>
                            <div class="usr-mg-info">
                                <h3>{this.state.tochatwith}</h3>
                            </div>
                            {/* <!--usr-mg-info end--> */}
                        </div>
                        <a href="#" title=""><i class="fa fa-ellipsis-v"></i></a>
                    </div>
                    {/* <!--message-bar-head end--> */}
{ this.state.tochatwith ?
(              
     <span>
                    <div className="messages-line" ref={div => this.messageList = div}>
                        {this.showpreviousmessages()}
                    </div>
                    
                    <div class="message-send-area">
                        <form>
                            <div class="mf-field">
                                <span>
                                    {this.emojihere()}
                                </span>
                                <button className="but1" onClick={this.getEmojiSelector}><i class="fa fa-smile-o"> </i></button>                                                                   
                                <input type="text" placeholder="Type a message here" ref={(ref) => this.mainInput= ref} required={true} name='message' onChange={this.handlechange} value={this.state.currentmsg} />
                                <button onClick={this.handleClick} className="but1"><i class="fa fa-paperclip"></i></button>
                                <input ref={input => this.inputElement = input} className=' file_sel' type="file" name="file" onChange={this.filehandleChange}  id="exampleFormControlFile1" />
                                <button onClick={this.sendmsg} className="but" type="submit">Send</button>
                            </div>
                        </form>
                    </div>
     </span>
    ):
    (
        this.state.toshowgroupid ? 
            (
                    // <h3 className="get_to_right">{this.state.toshowgroupname} - Information</h3><button className="get_to_right_2" onClick={()=>this.delete_group()}>delete</button>
                    <div class="messages-list2">
                        {/* <div> */}
                        <ul>
                        {this.showmembers()}
                        {this.showfriendstoaddingroup()}
                        {/* </div> */}
                        </ul>
                        </div>          
            )
            :
            null
    )
    }
                    {/* /* <!--message-send-area end--> */ }
                </div>
                {/* <!--main-conversation-box end--> */}
            </div>
        </div>
    </div>
    {/* <!--messages-sec end--> */}
</div>
</section>
{/* <!--messages-page end--> */}
    
</div>
                


            
            // <div class="container1">
            //     <div class="messaging">
            //         <div class="inbox_people">
            //             <div class="headind_srch">
            //                     <div class="recent_heading">
            //                     <button onClick={this.getCreating}>create</button>
            //                     </div>
            //                 <div class="srch_bar">
            //                     <div class="stylish-input-group">
            //                         <input type="text" class="search-bar"  placeholder="Search" />
            //                         <span class="input-group-addon">
            //                         <button type="button"></button>
            //                         </span>
            //                     </div>
            //                 </div>
            //             </div>
                    // {this.state.creating ? 
                    // (
                    //     <div >
                    //         <form>
                    //         {this.state.showDone ? <button onClick={this.creategroup}>Done</button> : null }
                    //             Name of group : <input required={true} value={this.state.newgroupchange} onChange={this.handlechange} name = "newgroupname" />
                    //         </form>
                    //             <div class="inbox_chat">
                    //                 <div>
                    //                     {this.showfriends()}
                    //                 </div>
                    //             </div>
                    //     </div>
                    // )    
                    // :
            //         (
            //             <div class="inbox_chat">
            //                 <div>{this.showgroups()}</div>                     
            //             </div>
            //         )
            //         }    
                    
            //     </div>
            //         {this.state.tochatwith
            //             ?                <div class="mesgs">
            //                 <div className="tochatwith">
            //                 {this.state.tochatwith}
            //                 </div>
            //                                       <div className="msg_history" ref={div => this.messageList = div}>
            //                                       {this.showpreviousmessages()}
            //                                   </div>
            //                                           <div class="type_msg">
            //                                           <div className="input_msg_write row ">           
            //                                           <input className="write_msg " placeholder="Type a message" ref={(ref) => this.mainInput= ref} required={true} type='text' name='message' onChange={this.handlechange} value={this.state.currentmsg}/>
            //                                           <button className=" attach btn btn-default " onClick={this.handleClick}>b</button>
            //                                           <input ref={input => this.inputElement = input} className=' file_sel' type="file" name="file" onChange={this.filehandleChange}  id="exampleFormControlFile1" />
            //                                           <button onClick={this.sendmsg} className="msg_send_btn btn btn-default" type="button">s</button>
            //                                           </div>
            //                                           </div>
            //                                           </div>
            //             :
                        // (
                        //     this.state.toshowgroupid ? 
                        //         (
                        //                 // <h3 className="get_to_right">{this.state.toshowgroupname} - Information</h3><button className="get_to_right_2" onClick={()=>this.delete_group()}>delete</button>
                        //                 <div class="inbox_chat">
                        //                     {/* <div> */}
                        //                     {this.showmembers()}
                        //                     {this.showfriendstoaddingroup()}
                        //                     {/* </div> */}
                        //                     </div>          
                        //         )
                        //         :
                        //         null
                        // )
            //         }
            //             </div>
            //     </div>
            // </div>    
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