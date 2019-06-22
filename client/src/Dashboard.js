import React, { Component } from 'react';
import socketIOClient from "socket.io-client";
import TextList from './profiles/TextList';
import PhotoList from './profiles/PhotoList';
import VideoList from './profiles/VideoList';
import {Modal, Button, Form} from 'react-bootstrap';

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
            postLoading: true,
            isTeam : null,   ///fetching whehter the user is team or member initially
            dashboardLoading: true,
            userDetails : {},
            postShow: false
        }
        this.uploadPost = this.uploadPost.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.gotopeople = this.gotopeople.bind(this);
        this.gotonoti = this.gotonoti.bind(this);
        this.gotogroups = this.gotogroups.bind(this);
        this.gotofriends = this.gotofriends.bind(this);
        this.gotocrowd = this.gotocrowd.bind(this);
        this.gotosettings = this.gotosettings.bind(this);
        this.gotoprofile = this.gotoprofile.bind(this);
        this.filehandleChange = this.filehandleChange.bind(this);
        this.renderPosts   = this.renderPosts.bind(this);
        this.fetchProfile = this.fetchProfile.bind(this);
        this.postHandleClose = this.postHandleClose.bind(this);
        this.postHandleShow   = this.postHandleShow.bind(this);
        this.fetchUser      = this.fetchUser.bind(this);
    }
    fetchdetails=()=>{
        if(this.state.people === undefined){
            this.setState({
                people:''
            });
        }
        
        fetch("http://localhost:2000/people/"+this.state.people,{
            method: "GET",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            credentials:'include',
        })    
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
        this.fetchUser();
        this.state.dashboardLoading = true;

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
                <img src={name.profilePhoto} alt=""/>
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
                        <img src={name.profilePhoto} alt=""/>
                    </div>
                        <div class="usr-mg-info">
                            <h3><a onClick={()=>this.gototeamprofile(name)}>{name.user}</a></h3>
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
                        <img src={name.profilePhoto} alt="pic"/>
                    </div>
                        <div class="usr-mg-info">
                            <h3><a onClick={()=>this.gotomemberprofile(name)}>{name.user}</a></h3>
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
            pathname:'/team/Profile/'+name.user+'/'+name.id,
            state :{
                username : this.props.location.state.username,
                profileuser : name.user 
            }
          }) ;
    }
    gotouserprofile=(name)=>{
        if(name.team){
            this.props.history.push({
                pathname:'/team/Profile/'+name.user+'/'+name.id,
                state :{
                    username : this.props.location.state.username,
                    profileuser : name.user 
                }
              }) ;
        }else{
            this.props.history.push({
                pathname:'/member/Profile/'+name.user+'/'+name.id,
                state :{
                    username : this.props.location.state.username,
                    profileuser : name.user 
                }
              }) ;    
        }
        
    }
    gotomemberprofile=(name)=>{
        this.props.history.push({
            pathname:'/member/Profile/'+name.user+'/'+name.id,
            state :{
                username : this.props.location.state.username,
                profileuser : name.user 
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
                        this.postHandleClose();

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
                        this.setState({desc:""});
                        this.postHandleClose();


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
               this.setState({desc:""});
               this.postHandleClose();

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
    gotosettings=(event)=>{
        event.preventDefault() ;
        this.props.history.push({
          pathname:'/settings/',
          state :{
              username : this.props.location.state.username 
          }
        }) ;
    }
    gotocrowd=(event)=>{
        event.preventDefault() ;
        this.props.history.push({
          pathname:'/crowdfunding/',
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
        if(this.state.userDetails.team)
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

                this.setState({postLoading:false})

            });
            
        })

    }

    fetchUser()
    {

        axios.get('http://localhost:2000/getUser',{withCredentials:true})
        .then((response)=>{
            this.setState({isTeam:response.data.team},()=>{this.fetchProfile()})

        })
        .catch((err)=>{throw err});

    }
    fetchProfile()
    {
        if(this.state.isTeam)
        {
            axios.get('http://localhost:2000/fetch_team_profile',{withCredentials:true})
            .then((response)=>{
                console.log(response.data);
                this.setState({userDetails:response.data[0]},()=>{ this.setState({dashboardLoading:false}); this.fetchPosts()})
               
            })
            .catch((err)=>{throw err});
        }
        else{
            axios.get('http://localhost:2000/fetch_member_profile',{withCredentials:true})
            .then((response)=>{
                console.log(response.data);
                this.setState({userDetails:response.data[0]},()=>{this.setState({dashboardLoading:false});this.fetchPosts()})
            })
            .catch((err)=>{throw err});

        }

    }


    postHandleClose() {
        this.setState({ postShow: false });
      }
    
      postHandleShow() {
        this.setState({ postShow: true });
      }

//returning post
    renderPosts()
    {

        

        if(this.state.postLoading)
        {
            return(
                <p>Loading...</p>
            )
        }
       else{
           var teamData = this.state.userDetails;
           var props    = this.props;
           var profilePhoto = this.state.userDetails.profilePhoto;
            const list = this.state.data.List.map(function(item)
            {

                if(props.location.state.isTeam)
                {
                    if(item.type=='text')
                    {
                        return(<TextList item={item} member={false} profilePhoto={profilePhoto} key={item._id} teamData={teamData} />)
                    }
                    else if(item.type=="photo")
                    {
                     return(<PhotoList item={item} member={false} profilePhoto={profilePhoto} key={item._id} teamData={teamData} />)
     
                    }
                    else{
                     return(<VideoList item={item} member={false} profilePhoto={profilePhoto} key={item._id} teamData={teamData} />)
     
                    }

                }
                else{
                    if(item.type=='text')
                    {
                        return(<TextList item={item} member={true} profilePhoto={profilePhoto} key={item._id} teamData={teamData} />)
                    }
                    else if(item.type=="photo")
                    {
                     return(<PhotoList item={item} member={true} profilePhoto={profilePhoto} key={item._id} teamData={teamData} />)
     
                    }
                    else{
                     return(<VideoList item={item} member={true} profilePhoto={profilePhoto} key={item._id} teamData={teamData} />)
     
                    }
                }
              
            })
            return list;

       }
    }

    render(){
      if(this.state.dashboardLoading)
        {
            return(
                <p>Loading</p>
            )

        }
        else{
            console.log(this.state.userDetails);
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
                                    {/* {this.state.filter === 'team' ? 
                                    <select className="form-control browser-default custom-select" name="filter2" value={this.state.filter2} onChange={this.handleChange}>
                                        <option selected>Username</option>
                                        <option>Field</option>
                                        <option>Institute</option>
                                    </select>
                                    :null} */}
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
                        <button onClick={this.gotonoti}>NOTIFICATIONS</button>
                        <button onClick={this.gotofriends}>FRIENDS</button>
                        <button onClick={this.gotogroups}>Groups</button>
                        <button onClick={this.gotoprofile}>Profile</button>
                        <button onClick={this.gotosettings}>Settings</button>
                        <button onClick={this.gotocrowd}>CrowdFunding</button>
                        {/* <button onClick={this.gotoprofile}>PROFILE</button> */}
                    </div>
                    <div className="post-topbar">
                        <div className="user-picy">
                        <img src={this.state.userDetails.profilePhoto} style={{borderRadius:'50%'}} alt />
                        </div>
                        <div className="post-st">
                        <ul>
                            <li><a className="post_project"  onClick={this.postHandleShow} title>Post</a></li>
                            <li><a className="post-jb active" href="#" title>Post a Job</a></li>
                        </ul>
                        </div>{/*post-st end*/}
                    </div>{/*post-topbar end*/}
                <div id="post-modal">
                <Modal show={this.state.postShow} onHide={this.postHandleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Posts</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form  onSubmit={this.uploadPost} encType="multipart/form-data"> 
                <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Control  value={this.state.desc} name="desc" onChange={this.handleChange} placeholder="write your post" as="textarea" rows="3" />
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>Upload Post</Form.Label>
                <Form.Control type="file" name="post"  onChange={this.filehandleChange} />
            </Form.Group>
                </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.postHandleClose}>
                    Close
                    </Button>
                    <Button variant="primary"  onClick={this.uploadPost} >
                    Upload Posts
                    </Button>
                </Modal.Footer>
                </Modal>
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