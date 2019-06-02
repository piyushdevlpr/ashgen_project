import React, { Component } from 'react';
import socketIOClient from "socket.io-client";
import TextList from './TextList';
import PhotoList from './PhotoList';
import VideoList from './VideoList';

const axios = require("axios");

class Dashboard extends Component {
    ismounted = true ;
    constructor(props){
        super(props) ;
        this.state = {
            username : '' ,
            userId : null,
            desc: '',
            post : null,
            data : {},
            loading: true
        }
        this.uploadPost = this.uploadPost.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.gotopeople = this.gotopeople.bind(this);
        this.gotonoti = this.gotonoti.bind(this);
        this.gotogroups = this.gotogroups.bind(this);
        this.gotofriends = this.gotofriends.bind(this);
        this.gotoprofile = this.gotoprofile.bind(this);
        this.filehandleChange = this.filehandleChange.bind(this);
        this.renderPosts   = this.renderPosts.bind(this);
    }
 
    componentDidMount(){ 
        this.ismounted = true ;
        this.fetchPosts();
     
    }
    componentWillUnmount(){
        this.ismounted = false ; 
    }
    filehandleChange(event)     // file handler
    {
        this.setState({
            [event.target.name]: event.target.files[0],
        })
       

    }
    handleChange=(event)=>{
        event.preventDefault() ;
        this.setState({
          [event.target.name] : event.target.value,
        })
        
    }

   

    uploadPost(event)
    {
        event.preventDefault() ;
       

        if(this.state.post!=null) // etiher photo or video
        {
            var postType = this.state.post.type.split('/')[0];  //getting file type for posting to server

            const config = {
                headers: {
                    'content-type': 'multipart/form-data'
                },
                withCredentials: true, // default
    
            };
            if(postType=="image")   
            {
                const formData = new FormData();    
      
                formData.append('photo',this.state.post);
                formData.append('desc', this.state.desc);
                // axios.post("https://ojus-server-132kgu2rdjqbfc.herokuapp.com/photo_upload",formData,config)
        
                axios.post("http://localhost:2000/photo_upload",formData,config)
                    .then((response) => {
                        alert("The Post is successfully uploaded");
                        var data = this.state.data;
                        data.List.unshift(response.data);
                        this.setState({data:data});
                        this.setState({desc:""})

                    }).catch((error) => {
                });

            }
            else if(postType=="video")
            {
                const formData = new FormData();    
      
                formData.append('video',this.state.post);
                formData.append('desc', this.state.desc);

                const config = {
                    headers: {
                        'content-type': 'multipart/form-data'
                    },
                    withCredentials: true, // default
        
                };
                
                // axios.post("https://ojus-server-132kgu2rdjqbfc.herokuapp.com/video_upload",formData,config)
        axios.post("http://localhost:2000/video_upload",formData,config)
                    .then((response) => {
                        alert("The Video is successfully uploaded");
                        var data = this.state.data;
                        data.List.unshift(response.data);
                        this.setState({data:data});
                        this.setState({desc:""})

                    }).catch((error) => {
                });  
            }
         

        }
        else{
            //text post
            var data = {};
            data.desc = this.state.desc;
            const config = {
               headers: {
                   'content-type': 'application/json'
               },
               withCredentials: true, // default
   
           };
        //    axios.post("https://ojus-server-132kgu2rdjqbfc.herokuapp.com/text_upload",data,config)
        
           axios.post("http://localhost:2000/text_upload",data,config)
           .then((response) => {
               alert("The Post is successfully uploaded");
               var data = this.state.data;
               data.List.unshift(response.data);
               this.setState({data:data});
               this.setState({desc:""})
           }).catch((error) => {

       });


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
    gotogroups=(event)=>{
        event.preventDefault() ;
        this.props.history.push({
          pathname:'/groups/',
          state :{
              username : this.props.location.state.username 
          }
        }) ;
    }
    gotofriends=(event)=>{
        event.preventDefault() ;
        this.props.history.push({
          pathname:'/friends/',
          state :{
              username : this.props.location.state.username 
          }
        }) ;
    }
    gotoprofile=(event)=>{
        event.preventDefault() ;
        this.props.history.push({
          pathname:'/profile/',
          state :{
              username : this.props.location.state.username 
          }
        }) ;
    }

    fetchPosts()
    {
        axios.get('http://localhost:2000/dashboard_posts').then((response)=>{
        // axios.get('https://ojus-server-132kgu2rdjqbfc.herokuapp.com/dashboard_posts').then((response)=>{
        // console.log(response);
            this.setState({data:response.data},()=>{

                this.setState({loading:false})

            });
            
        })

    }

//returning post
    renderPosts()
    {

        

        if(this.state.loading)
        {
            return(
                <p>Loading...</p>
            )
        }
       else{
           const list = this.state.data.List.map(function(item)
           {
               if(item.type=='text')
               {
                   return(<TextList item={item} key={item._id} />)
               }
               else if(item.type=="photo")
               {
                return(<PhotoList item={item} key={item._id} />)

               }
               else{
                return(<VideoList item={item} key={item._id} />)

               }
           })

           return list;
       }
        
       

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
                        <button onClick={this.gotonoti}>NOTIFICATIONS</button>
                        <button onClick={this.gotofriends}>FRIENDS</button>
                        <button onClick={this.gotogroups}>Groups</button>
                        {/* <button onClick={this.gotoprofile}>PROFILE</button> */}
                    </div>
                    <div className="col">
      
                    </div>
                    <div className="col-6 container">
                        <div className="card" style={{marginBottom:"25px"}}>
                        <div className="card-body">
                        <h5 className="card-title">Create Post</h5>

                    <div>
                    <form onSubmit={this.uploadPost} encType="multipart/form-data">
                    <div className="form-group">
                    <textarea className="form-control" id="exampleFormControlTextarea1" rows="3" name="desc" value={this.state.desc} onChange={this.handleChange} placeholder="write your post"></textarea>
                 </div>
                 <div >
                 <div style={{display:'inline'}}  className="form-group">
                {/* <label htmlFor="exampleFormControlFile1">Post Upload</label> */}
                <input style={{display:'inline', width:'50%'}}    type="file" name="post"  onChange={this.filehandleChange} className="form-control-file" id="post-upload" />
                </div>
                <div style={{display:'inline', float:'right'}}>
                <button type="submit" className="btn btn-primary">Post</button>
                </div>
                </div>

             </form>
             </div>
             </div>
             </div>
          
                <div className="posts"> 
                {this.renderPosts()}
                
                </div>
                </div>
                

                <div className="col">

                </div>


                </div>
            );
        }        
    }
}
export default Dashboard ;