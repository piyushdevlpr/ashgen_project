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
            photo: null,
            video: null,
            isphoto : false,          //this parameter used for either photo or video upload
            data : {},
            loading: true
        }
        this.uploadPost = this.uploadPost.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.gotopeople = this.gotopeople.bind(this);
        this.gotonoti = this.gotonoti.bind(this);
        this.gotofriends = this.gotofriends.bind(this);
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
        event.target.name==='photo'?this.setState({isphoto:true}):this.setState({isphoto:false});
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
        if(this.state.isphoto)   // if photo uplod
        {
            const formData = new FormData();    
      
            formData.append('photo',this.state.photo);
            formData.append('desc', this.state.desc);
            const config = {
                headers: {
                    'content-type': 'multipart/form-data'
                },
                withCredentials: true, // default
    
            };
            axios.post("http://localhost:2000/photo_upload",formData,config)
                .then((response) => {
                    alert("The Photo is successfully uploaded");
                    var data = this.state.data;
                    data.List.unshift(response.data);
                    this.setState({data:data})
                }).catch((error) => {
            });
            
            
        }
        else{        //if video or text upload
                 if(this.state.video!=null)  //video upload
                 {
                    const formData = new FormData();    
      
                    formData.append('video',this.state.video);
                    formData.append('desc', this.state.desc);

                    const config = {
                        headers: {
                            'content-type': 'multipart/form-data'
                        },
                        withCredentials: true, // default
            
                    };
                    axios.post("http://localhost:2000/video_upload",formData,config)
                        .then((response) => {
                            alert("The Video is successfully uploaded");
                            var data = this.state.data;
                            data.List.unshift(response.data);
                            this.setState({data:data})
                        }).catch((error) => {
                    });                   


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
                        axios.post("http://localhost:2000/text_upload",data,config)
                        .then((response) => {
                            alert("The Post is successfully uploaded");
                            var data = this.state.data;
                            data.List.unshift(response.data);
                            this.setState({data:data});
                        }).catch((error) => {
                    });  


                      }
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
    gotofriends=(event)=>{
        event.preventDefault() ;
        this.props.history.push({
          pathname:'/friends/',
          state :{
              username : this.props.location.state.username 
          }
        }) ;
    }

    fetchPosts()
    {
        axios.get('http://localhost:2000/dashboard_posts').then((response)=>{
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
                    </div>
                    <div>
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
             </div>
                <div className="posts"> 
                {this.renderPosts()}
                
                </div>


                </div>
            );
        }        
    }
}
export default Dashboard ;