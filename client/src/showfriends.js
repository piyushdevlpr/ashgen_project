import React, { Component } from 'react';
import ChatText from './ChatText';
import ChatPhoto from './ChatPhoto';
import ChatVideo from './ChatVideo';
import ScrollToBottom from 'react-scroll-to-bottom';
import './Chat.css'
import socketIOClient from "socket.io-client";
//Css file import
import './assets/css/animate.css'
import './assets/css/bootstrap.min.css'
import './assets/css/flatpickr.min.css'
import './assets/css/font-awesome.min.css'
import './assets/css/jquery.range.css'
import './assets/css/line-awesome.css'
import './assets/css/line-awesome-font-awesome.min.css'
import './assets/css/responsive.css'
import './assets/css/style.css'
// https://ojus-server-132kgu2rdjqbfc.herokuapp.com
const socket = socketIOClient('http://127.0.0.1:2000',{transports: ['websocket']});


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
            previousmess : [{from:'',data:''}],
            file: null
        }
        this.handlechange=this.handlechange.bind(this);
        this.sendmsg=this.sendmsg.bind(this);
        this.filehandleChange = this.filehandleChange.bind(this);  //function for file in chat
    }
    updatecount=()=>{
        var data = {friend : this.state.tochatwith , number: this.state.friendsnewmessage[this.state.tochatwith]} ;
        fetch("http://localhost:2000/update-new-message-number", {
            // fetch(" https://ojus-server-132kgu2rdjqbfc.herokuapp.com/update-new-message-number", {
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
        this.abortController.abort() ;
    }
    handlechange=(event)=>{
        event.preventDefault();
        this.setState({
            message:event.target.value
        })
    }
    getfriends=()=>{
        fetch("http://localhost:2000/get-friends", {
            // fetch(" https://ojus-server-132kgu2rdjqbfc.herokuapp.com/get-friends", {
            signal:this.abortController.signal,
            method: "GET",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            credentials:'include'
          }).then(res => res.json()).then(data => {
              this.setState({friends:data.sort(function(m1,m2){return m2.lastUpdatedAt - m1.lastUpdatedAt})},function(){
            var map = this.state.friendsnewmessage;  
            for(var i = 0 ; i < this.state.friends.length ; i++){
                map[this.state.friends[i].name] = this.state.friends[i].newmess ;
              }
              this.setState({friendsnewmessage : map },function(){
                console.log(this.state) ;
              })
          })}).catch(err=> {
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
    getmetochat=(friend_name)=>{
        var list = this.state.friendsnewmessage ;
        list[friend_name] = 0 ;
        this.setState({tochatwith : friend_name , previousmess:[],friendsnewmessage:list},function(){
            this.getsockethere() ;
            this.updatecount() ;
            // if(this.state.tochatwith){ 
            //     this.scrollToBottom() ;
            //     }
        }) ;
    }
    showfriends=()=>{
        const list = this.state.friends.map((data,index)=>
            <div class="chat_list">
              <div class="chat_people">
                <div class="chat_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"/> 
                </div>
                <div class="chat_ib">
                  <h5>{data.name}</h5>
                  <button onClick={()=>this.getmetochat(data.name)}>message</button>
                  <span>{this.state.friendsnewmessage[data.name] ? (<span> {this.state.friendsnewmessage[data.name]}  message received </span>): null}</span>
                </div>
              </div>
            </div>
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
            if(msg){
            var file= this.state.file;     // only for checking at server if this is null
            this.setState({message : ""},function(){
                socket.emit("newmessage",{username:this.props.location.state.username,friendname:this.state.tochatwith ,message:msg,file:file}) ;
            })
        }
        }
        else{
            var msg = this.state.message ;
            // if(msg){
            var file= this.state.file;
            var fileName= file.name;
            var fileType = file.type.split('/')[0];
            this.setState({message : ""},function(){
                socket.emit("newmessage",{username:this.props.location.state.username,friendname:this.state.tochatwith ,message:msg,file:this.state.file,fileName,fileType}) ;
            }); 
            // }
        }
        
        this.mainInput.value = "";
    }   
    showpreviousmessages=()=>{        
        const list = this.state.previousmess.map((data,index)=>
        {
            if(data.data.format=="text") 
            {   
               return( <ChatText data={data} user={this.props.location.state.username}/>)

            }
            else if(data.data.format=="image")
            {
                return (<ChatPhoto data={data} user={this.props.location.state.username}/>)
            }
            else if(data.data.format=="video")
            {
                return(<ChatVideo data={data} user={this.props.location.state.username}/>)
            }
            // <li>{data.from} : {data.data.message}</li>
        }
            );
            
            return list ;
    }   
    componentDidUpdate() {
        if(this.state.tochatwith){
        this.scrollToBottom();
        }
      }
    componentWillMount(){ 
        this.getfriends() ;
        this.showfriends() ;
        socket.emit('join',{username:this.props.location.state.username}) ;
        socket.on("newmessagereceived",data=>{
            this.setState(state => {
                // if(data.message.from !== this.state.tochatwith && data.message.from === this.props.location.state.username){
                //     return ;
                // }
                
                if(data.messages.from !== this.state.tochatwith && data.messages.from !== this.props.location.state.username){ //if currentuser is not the one who has sent msg and the person with whom the user is chatting has not sent the message
                    var list2 = this.state.friendsnewmessage ;
                    list2[data.messages.from]++ ;
                    var x = {} ;
                    var z = []
                    z = this.state.friends ;
                    for(var i = 0 ; i < z.length ; i++){
                        if(z[i].name == data.messages.from){
                            x = z[i] ;
                            z.splice(i,1) ;
                            break ;
                        }
                    }
                    z.unshift(x) ;
                    return {
                        friendsnewmessage:list2,
                        friends : z
                    };  
                }
                const list = state.previousmess.slice();
                list.push(data.messages);           // add new msg to previous ones only if currentuser is the one who has sent msg or to whom msg has been sent
                console.log(data.messages.data) ;
                var z = []
                z = this.state.friends ;
                if(data.messages.from === this.props.location.state.username){
                    var x = {} ;
                    for(var i = 0 ; i < z.length ; i++){
                        if(z[i].name == this.state.tochatwith){
                            x = z[i] ;
                            z.splice(i,1) ;
                            break ;
                        }
                    }
                    z.unshift(x) ;
                }else{
                    socket.emit("newmesstozero",{friendname:this.state.tochatwith,currentuser:this.props.location.state.username});
                }
                return {
                  previousmess:list,
                  friends : z 
                };
              });
            }
            );
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
        <div class="container1">
            <div class="messaging">
                <div class="inbox_people">
                    <div class="headind_srch">
                            <div class="recent_heading">
                                <h4>Recent</h4>
                            </div>
                        <div class="srch_bar">
                            <div class="stylish-input-group">
                                <input type="text" class="search-bar"  placeholder="Search" />
                                <span class="input-group-addon">
                                <button type="button"></button>
                                </span>
                            </div>
                        </div>
                    </div>
                <div class="inbox_chat">
                        <div>{this.showfriends()}</div>                     
                </div>
            </div>
                    { this.state.tochatwith ?
                        (
                            <div class="mesgs">
                               <div className="tochatwith">{this.state.tochatwith}</div>
                            <div className="msg_history" ref={div => this.messageList = div}>
                            {this.showpreviousmessages()}
                            </div>
                        {/* <div class="type_msg">
                            <div className="input_msg_write row ">
                                
                                <input className="write_msg" placeholder="Type a message" ref={(ref) => this.mainInput= ref} required={true} type='text' name='message' onChange={this.handlechange} value={this.state.currentmsg}/>
                                <button className=" attach btn btn-default  " onClick={this.handleClick}><i class="fa fa-paperclip"></i></button>
                                <input ref={input => this.inputElement = input} className=' file_sel' type="file" name="file" onChange={this.filehandleChange}  id="exampleFormControlFile1" />
                                <button onClick={this.sendmsg} className="msg_send_btn btn btn-default " type="button">s</button>
                            </div>
                        </div> */}
                        <div class="message-send-area">
									<form>
										<div class="mf-field">
											<input type="text" name="message" placeholder="Type a message here"/>
											<button type="submit">Send</button>
										</div>
										<ul>
											<li><a href="#" title=""><i class="fa fa-smile-o"></i></a></li>
											<li><a href="#" title=""><i class="fa fa-camera"></i></a></li>
											<li><a href="#" title=""><i class="fa fa-paperclip"></i></a></li>
										</ul>
									</form>
								</div>
                        </div>
                        ):null
                    }
                </div>
            </div>
            );
        }        
    }
}
var styles = {
	backgroundColor:'#D3D3D3',
    overflow:'scroll',
    width:'100%',
    // height : '510px',
    'overflow-y':'auto'
};
var styles2 = {
    //  height:'100%',
     padding : '0px',
     margin : '0px'
};
var styles3 = {
    overflow : 'hidden'
    // backgroundSize : 'cover'
 };
export default People ;