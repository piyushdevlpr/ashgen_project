import React, { Component } from 'react';
import socketIOClient from "socket.io-client";

class Dashboard extends Component {
    ismounted = true ;
    constructor(props){
        super(props) ;
        this.state = {
            response : '',
            endpoint : "http://127.0.0.1:2000",
            username : '' 
        }
        this.uploadPost = this.uploadPost.bind(this);
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
        // socket.on("react",this.setthestate);      
        // socket.emit("incoming", this.state.username) ; 
    }
    componentWillUnmount(){
        this.ismounted = false ; 
    }

    uploadPost(event)
    {
        event.preventDefault() ;
  if(this._ismounted === true){
  console.log(this.state) ;
  fetch("127.0.0.1:2000/post_upload", {
            method: "POST",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(this.state)
        }).then(res => res.json()).then(data => {if(this._ismounted === true){this.setState({loggedin : data})}})
        console.log(this.state) ;
  }
    }
    render(){
        if(this.props.location.state === undefined){
            this.props.history.push("/") ;
            return null ;
        }else{
            return(
                <div className="container">
                    <form onSubmit={this.uploadPost}>
                    <div className="form-group">
                    <label for="exampleFormControlTextarea1">Upload post</label>
                    <textarea className="form-control" id="exampleFormControlTextarea1" rows="3" placeholder="write your post"></textarea>
                 </div>
                 <div className="row">
                 <div class="form-group">
                <label for="exampleFormControlFile1">Photo Upload</label>
                <input type="file" className="form-control-file" id="photo-upload" />
                </div>
                <div class="form-group">
                <label for="exampleFormControlFile1">Video Upload</label>
                <input type="file" className="form-control-file" id="video-upload" />
                </div>
                <button type="submit" className="btn btn-primary">Post</button>

                </div>
             </form>
                  
                </div>
            );
        }        
    }
}
export default Dashboard ;