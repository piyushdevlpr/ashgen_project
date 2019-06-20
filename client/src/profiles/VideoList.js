import React, { Component } from 'react';
import axios from 'axios';
import Comment from './Comment'

export default class VideoList extends Component{

      constructor(props){
        super(props) ;
        this.state = {
          comment:'',   //user can write comment
          liked:false,
          item : this.props.item,
          comments: [],          //posts comments
          likes: [],           //list of post likes
          likeInfo:{},
          commentsLoading: true,
          likesLoading:true,
          commentToggle:false,  //when comment button clicked a box appear below
        }
        this.postComment = this.postComment.bind(this);
        this.OnCommentChange  = this.OnCommentChange.bind(this);
        this.fetchComments  = this.fetchComments.bind(this);
        this.toggleLike = this.toggleLike.bind(this);
        this.fetchLikes = this.fetchLikes.bind(this);
        this.checkIfLiked = this.checkIfLiked.bind(this);
        // this.fetchShare   = this.fetchShare.bind(this);
        // this.postShare = this.postShare.bind(this);
      
    }

    checkIfLiked()
    {

        const config = {
            headers: {
                'content-type': 'application/json'
            },
            withCredentials: true, // default

        };
        var data ={};
        data.post_id = this.props.item._id;
        // axios.post(' https://ojus-server-132kgu2rdjqbfc.herokuapp.com/check_like',data,config)
        axios.post('http://localhost:2000/check_like',data,config)
        .then((response)=>{

            if(response.data.check==true)
            {
                this.setState({liked:true});
                this.setState({likeInfo:response.data.likeInfo});
            }

        })
        .catch((err)=>{
            throw err;
        })


    }

    fetchLikes()
    {
       if(this.state.likesLoading)
       {
        var data ={}
        var post_id = this.state.item._id;
        data.post_id = post_id;
        const config = {
            headers: {
                'content-type': 'application/json'
            },
            withCredentials: true, // default

        };
        var list;

        axios.post('http://localhost:2000/fetch_likes',data,config)
        // axios.post(' https://ojus-server-132kgu2rdjqbfc.herokuapp.com/fetch_likes',data,config)
        .then((response)=>{
            // console.log(response.data);
            this.setState({likes:response.data},()=>{this.setState({likesLoading:false})})
        
        })
       }
      //  else{

      //   list = this.state.likes.map(function(item)
      //   {
      //       return(
      //           <div style={{display:'inline', marginRight:'5px'}} key={item._id}>
      //               <p style={{display:'inline'}}>{item.author.username}</p>
      //           </div>
      //       )
      //   })

      //   return list;

      //  }
    }
    componentWillMount()
    {
      this.checkIfLiked();
    }

    toggleLike(event)
    {
        event.preventDefault();

        const config = {
            headers: {
                'content-type': 'application/json'
            },
            withCredentials: true, // default

        };
        if(!this.state.liked)
        {
            var  data = {};
            data.id = this.state.item._id;
            axios.post('http://localhost:2000/post_like',data,config)
            // axios.post(' https://ojus-server-132kgu2rdjqbfc.herokuapp.com/post_like',data,config)
            .then((response)=>{

                var likes  =this.state.likes;
                likes.unshift(response.data);
                this.setState({likes:likes}, ()=>{
                    this.setState({liked:true});
                    this.checkIfLiked();
                });
             
            
            })
            .catch((error)=>{
                throw error;
            })

    }
    else{
        var  data = {};
        data.likeInfo = this.state.likeInfo;
        axios.post('http://localhost:2000/post_unlike',data,config)
        // axios.post(' https://ojus-server-132kgu2rdjqbfc.herokuapp.com/un_like',data,config)
        .then((response)=>{
            
                this.setState({liked:false});
                this.setState({likesLoading:true})
        })
        .catch((error)=>{
            throw error;
        })


    }
        

    }







    OnCommentChange(event)
    {
        event.preventDefault();
        this.setState({
            [event.target.name] : event.target.value,
          })

          console.log(event.target.value);
    }

    postComment(event)
    {
        event.preventDefault() ;
        const config = {
            headers: {
                'content-type': 'application/json'
            },
            withCredentials: true, // default

        };
        const data = {

        }
        data._id = this.state.item._id;   //post id
        data.comment = this.state.comment; // comment

        axios.post('http://localhost:2000/post_comment',data,config)
        // axios.post(' https://ojus-server-132kgu2rdjqbfc.herokuapp.com/post_comment',data,config)
        .then((response)=>{
        //    console.log(response.data);
            var comments  =this.state.comments;
            comments.unshift(response.data);
            this.setState({comments:comments}, ()=>{
                this.setState({comment:''})
            });

        })
        .catch((error)=>{
            throw error;
        })



    }

    fetchComments()
    {

        if(this.state.commentsLoading)
        {
            var data ={}
            var post_id = this.state.item._id;
            data.post_id = post_id;
            const config = {
                headers: {
                    'content-type': 'application/json'
                },
                withCredentials: true, // default

            };
            var list;

            axios.post('http://localhost:2000/fetch_comments',data,config)
            // axios.post(' https://ojus-server-132kgu2rdjqbfc.herokuapp.com/fetch_comments',data,config)
            .then((response)=>{
                // console.log(response.data);
                this.setState({comments:response.data},()=>{this.setState({commentsLoading:false})})
            
            })
    }
    else{
      var teamData=this.props.teamData;
      var profilePhoto = this.props.profilePhoto
        list = this.state.comments.map(function(item)
        {
            return(
                <Comment  profilePhoto={profilePhoto} key={item._id} comment={item} teamData={teamData}/>
                
            )
        })

        return list;


    }
    }
    

    

    render()
    {
        return(
            <div className="post-bar">
                                  <div className="post_topbar">
                                    <div className="usy-dt">
                                      <img style={{height:50, width:50}} src={this.props.profilePhoto} alt />
                                      <div className="usy-name">
                                        <h3>{this.props.teamData.team_name}</h3>
                                        <span><img src="../assets/images/clock.png" alt />3 min ago</span>
                                      </div>
                                    </div>
                                    <div className="ed-opts">
                                      <a href="#" title className="ed-opts-open"><i className="la la-ellipsis-v" /></a>
                                      <ul className="ed-options">
                                        <li><a href="#" title>Edit Post</a></li>
                                        <li><a href="#" title>Unsaved</a></li>
                                        <li><a href="#" title>Unbid</a></li>
                                        <li><a href="#" title>Close</a></li>
                                        <li><a href="#" title>Hide</a></li>
                                      </ul>
                                    </div>
                                  </div>
                                  <div className="epi-sec">
                                    <ul className="descp">
                                      <li><img src="../assets/images/icon8.png" alt /><span>Front End Developer</span></li>
                                      <li><img src="../assets/images/icon9.png" alt /><span>India</span></li>
                                    </ul>
                                    <ul className="bk-links">
                                      <li><a href="#" title><i className="la la-bookmark" /></a></li>
                                      <li><a href="#" title><i className="la la-envelope" /></a></li>
                                      <li><a href="#" title className="bid_now">Bid Now</a></li>
                                    </ul>
                                  </div>
                                  <div className="job_descp">
                                  <p>{this.props.item.desc}</p>
                                    {/* <ul className="job-dt">
                                      <li><span>$300 - $350</span></li>
                                    </ul>  */}
            <iframe style={{width:'100%', height:350}} className="embed-responsive-item" src="https://www.youtube.com/embed/zpOULjyy-n8?rel=0"></iframe>

                                    {/* <ul className="skill-tags">
                                      <li><a href="#" title>HTML</a></li>
                                      <li><a href="#" title>PHP</a></li>
                                      <li><a href="#" title>CSS</a></li>
                                      <li><a href="#" title>Javascript</a></li>
                                      <li><a href="#" title>Wordpress</a></li> 	
                                    </ul> */}
                                  </div>
                                  <div className="job-status-bar">
                                    <ul className="like-com">
                                      <li>
                                        <a href="#" style={{color:this.state.liked?'blue':'#000'}} onClick={this.toggleLike}><i className="la la-thumbs-o-up" /> Upvote</a>
                                        <p style={{float:'left', marginTop:3}}>{this.state.likes.length}</p>
                                        {this.fetchLikes()}
                                      </li> 
                                      <li><a href="#" title className="com" onClick={()=>{this.setState({commentToggle:true})}}><img src="../assets/images/com.png" alt /> Comment {this.state.comments.length}</a></li>
                                    </ul>
                                  </div>
                                  <div id="comment" style={{display:this.state.commentToggle?'block':'none'}} className="job-status-bar">
                                    <div  id="comment-sections" style={{width:'100%', padding:10}}>
                                    <img style={{height:45, width:45, float:'left', borderRadius: '50%'}} src={this.props.profilePhoto} alt />
                                      <form  style={{float:'left', width:'85%', marginLeft:'1.5%', marginTop:2}} onSubmit={this.postComment}>

                                      <div className="input-group mb-3" >
          
                                      <input  type="comment" onChange={this.OnCommentChange} name="comment" value={this.state.comment} className="form-control" placeholder="Write comment" aria-label="comment" aria-describedby="basic-addon1" />
                                      </div>
                                      </form>
                                      </div>
                                      <div>
                                      {this.fetchComments()}
                                      </div>

                                  </div>
                                </div>

        )
    }
}