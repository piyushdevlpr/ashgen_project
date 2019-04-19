import React, { Component } from 'react';
import socketIOClient from "socket.io-client";

class Dashboard extends Component {
    ismounted = true ;
    constructor(props){
        super(props) ;
        this.state = {
            username : '' ,
            userId : null,
            desc: '',
            photo: null,
            video: null,
            isphoto : true,          //this parameter used for either photo or video upload
        }
        this.uploadPost = this.uploadPost.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.gotopeople = this.gotopeople.bind(this);
        this.gotonoti = this.gotonoti.bind(this);
        this.filehandleChange = this.filehandleChange.bind(this)
    }
 
    componentDidMount(){ 
        this.ismounted = true ;
     
    }
    componentWillUnmount(){
        this.ismounted = false ; 
    }
    filehandleChange(event)     // file handler
    {
        console.log(event.target.name);
        event.target.name==='photo'?this.setState({isphoto:true}):this.setState({isphoto:false});
        this.setState({
            [event.target.name]: event.target.files[0],
        })
        console.log(this.state.isphoto);
        console.log(this.state.video);          // only printing null after setting state

    }
    handleChange=(event)=>{
        event.preventDefault() ;
        this.setState({
          [event.target.name] : event.target.value,
        })
        console.log(this.state.desc);
        
    }

    uploadPost(event)
    {
        event.preventDefault() ;
        if(this.ismounted === true){
        fetch("http://localhost:2000/getUser", {
                    method: "GET",
                    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                    credentials: 'include'
                }).then(res => res.json()).then(data => {
                    if(this.state.isphoto)   // ignore this
                    {
                        console.log(this.state.photo);     
                    }

                })
    
  }
    }
    gotopeople=(event)=>{
        event.preventDefault() ;
        this.props.history.push({
          pathname:'/people/',
          state :{
              username : this.props.location.state.username 
          }
        }) ;
    }
    gotonoti=(event)=>{
        event.preventDefault() ;
        this.props.history.push({
          pathname:'/notifications/',
          state :{
              username : this.props.location.state.username 
          }
        }) ;
    }
    render(){
        if(this.props.location.state === undefined){
            this.props.history.push("/") ;
            return null ;
        }else{
            return(
                <div className="container">
                   <div>
                        <button onClick={this.gotopeople}>PEOPLE</button>
                        <button onClick={this.gotonoti}>Notifications</button>
                    </div>
                    <form onSubmit={this.uploadPost} encType="multipart/form-data">
                    <div className="form-group">
                    <label htmlFor="exampleFormControlTextarea1">Upload post</label>
                    <textarea className="form-control" id="exampleFormControlTextarea1" rows="3" name="desc" value={this.state.desc} onChange={this.handleChange} placeholder="write your post"></textarea>
                 </div>
                 <div className="row">
                 <div className="form-group">
                <label htmlFor="exampleFormControlFile1">Photo Upload</label>
                <input type="file" name="photo" onChange={this.filehandleChange} className="form-control-file" id="photo-upload" />
                </div>
                <div className="form-group">
                <label htmlFor="exampleFormControlFile1">Video Upload</label>
                <input type="file" name="video"  onChange={this.filehandleChange} className="form-control-file" id="video-upload" />
                </div>
                <button type="submit" className="btn btn-primary">Post</button>

                </div>
             </form>
              {console.log(this.state.video)}                    
                </div>
            );
        }        
    }
}
export default Dashboard ;