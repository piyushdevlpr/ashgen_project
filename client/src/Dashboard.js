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
            filter:'',
            people : '',
            user : [],
            username : '' ,
            userId : null,
            desc: '',
            post : null,
            data : {},     // all posts
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
    fetchdetails=()=>{
        if(this.state.people === undefined){
            this.setState({
                people:''
            });
        }
        
        fetch("http://localhost:2000/people/"+this.state.people)
        // fetch("https://ojus-server-132kgu2rdjqbfc.herokuapp.com/people/"+this.state.people)    
        .then(response => response.json())
        .then(datas =>{
          this.setState({
            //propiclink: datas.propic,
            user : datas
          })
          console.log(this.state.people) ;
          console.log(this.state.user) ;
        }
        )
        .catch(error => console.log(error));
    }
    componentDidMount(){ 
        this.ismounted = true ;
        this.fetchPosts();
        console.log(this.props.location)

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
    showusers=()=>{
        if(this.state.people){
        if(this.state.user.length === 0){
            return (
                <div>
                    NO SUCH USER
                </div>
            );
        }else{
        if(this.state.filter === "All" || this.state.filter === ""){
        return(
        this.state.user.map((name,key)=>
        <li >
        <div class="usr-msg-details">
            <div class="usr-ms-img">
                {/* <img src={data.profilePhoto} alt=""/> */}
            </div>
                <div class="usr-mg-info">
                    <h3><a onClick={()=>this.gotouserprofile(name)}>{name.user}</a> </h3>
                </div>
            </div>
        </li>             
        )
        );
        }else if(this.state.filter === "team"){
            return(
                this.state.user.map((name,key)=>
                <span>{
                name.team 
                ?
                <li>
                <div class="usr-msg-details">
                    <div class="usr-ms-img">
                        {/* <img src={data.profilePhoto} alt=""/> */}
                    </div>
                        <div class="usr-mg-info">
                            <h3><a onClick={()=>this.gototeamprofile(name.user)}>{name.user}</a></h3>
                        </div>
                    </div>
                </li>
                :
                 null
                }  
                </span>            
                )
                );
        }else{
            return(
                this.state.user.map((name,key)=>
                <span>{
                !name.team 
                ?
                <li>
                <div class="usr-msg-details">
                    <div class="usr-ms-img">
                        {/* <img src={data.profilePhoto} alt=""/> */}
                    </div>
                        <div class="usr-mg-info">
                            <h3><a onClick={()=>this.gotomemberprofile(name.user)}>{name.user}</a></h3>
                        </div>
                    </div>
                </li>
                :
                 null
                }  
                </span>            
                )
                );
        }
    }
    }
    }
    gototeamprofile=(name)=>{
        this.props.history.push({
            pathname:'/team/Profile/'+name,
            state :{
                username : this.props.location.state.username,
                profileuser : name 
            }
          }) ;
    }
    gotouserprofile=(name)=>{
        if(name.team){
            this.props.history.push({
                pathname:'/team/Profile/'+name.user,
                state :{
                    username : this.props.location.state.username,
                    profileuser : name.user 
                }
              }) ;
        }else{
            this.props.history.push({
                pathname:'/member/Profile/'+name.user,
                state :{
                    username : this.props.location.state.username,
                    profileuser : name.user 
                }
              }) ;    
        }
        
    }
    gotomemberprofile=(name)=>{
        this.props.history.push({
            pathname:'/member/Profile/'+name,
            state :{
                username : this.props.location.state.username,
                profileuser : name 
            }
          }) ;
    }
    handlechange=(event)=>{
        event.preventDefault();
        this.setState({
            [event.target.name]:event.target.value
         },function(){
            this.fetchdetails() ;
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
    async gotoprofile(event){
        event.preventDefault() ;
        if(this.props.location.state.isTeam)
        {
            this.props.history.push({
                pathname:'/team_profile/',
                state :{
                    username : this.props.location.state.username 
                }
              }) ;

        }
        else{
            this.props.history.push({
                pathname:'/member-profile/',
                state :{
                    username : this.props.location.state.username 
                }
              }) ;

        }
         
       
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
                    <div className="row">
                    <div className="col-3"> 
                        <div>
                            <div>
                                <form>
                                    <input className="form-control" placeholder="search" value={this.state.people} onChange={this.handlechange} name = "people"/><br/>
                                    <select className="form-control browser-default custom-select" name="filter" value={this.state.filter} onChange={this.handleChange}>
                                        <option selected>All</option>
                                        <option>team</option>
                                        <option>team members</option>
                                    </select>
                                </form>
                        <div class="msgs-list">
                        <div class="messages-list">
									<ul>
                                        {this.showusers()}                                
									</ul>
								</div>
                        </div>
                    </div>
                    </div>
                    </div>
                    <div className="col-6 container">
                    <div>
                        <button onClick={this.gotopeople}>PEOPLE</button>
                        <button onClick={this.gotonoti}>NOTIFICATIONS</button>
                        <button onClick={this.gotofriends}>FRIENDS</button>
                        <button onClick={this.gotogroups}>Groups</button>
                        <button onClick={this.gotoprofile}>Profile</button>

                        {/* <button onClick={this.gotoprofile}>PROFILE</button> */}
                    </div>
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
                

                <div className="col-3">
                
                </div>
                </div>
                {console.log(this.state)}
                </div>
            );
        }        
    }
}
export default Dashboard ;