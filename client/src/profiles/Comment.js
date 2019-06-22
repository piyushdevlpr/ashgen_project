import React, { Component } from 'react';
import axios from 'axios';
import Reply from './Reply';

export default class Comment extends Component{
    constructor(props){
        super(props) ;
        this.state = {
            reply:'',  //user can reply to comment
            replies:[],  // contains all replies to comment
            repliesLoading: true,
            liked : false,
            likeInfo:{},
            likes: [],           //list of post likes
            likesLoading: true,  
            commentUserData: null,
            commentLoading: true,
            repliesLoading: true,
            repliesToggle : false


        }
        this.fetchCommentUser = this.fetchCommentUser.bind(this);
        this.OnReplyChange = this.OnReplyChange.bind(this);
        this.postReply   = this.postReply.bind(this);
        this.fetchReplies  = this.fetchReplies.bind(this);
        this.checkIfLiked = this.checkIfLiked.bind(this);
        this.fetchLikes   = this.fetchLikes.bind(this);
        this.toggleLike  = this.toggleLike.bind(this);
    
    }


    fetchLikes()
    {
    if(this.state.likesLoading)
    {
        var data ={}
        var comment_id = this.props.comment._id;
        data.comment_id = comment_id;
        const config = {
            headers: {
                'content-type': 'application/json'
            },
            withCredentials: true, // default

        };

        axios.post('http://localhost:2000/comment_fetch_likes',data,config)
        // axios.post(' https://ojus-server-132kgu2rdjqbfc.herokuapp.com/fetch_likes',data,config)
        .then((response)=>{
            // console.log(response.data);
            console.log(response.data)
            this.setState({likes:response.data},()=>{this.setState({likesLoading:false})})
        
        })
        
    }
   
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

        data.comment_id = this.props.comment._id;
        // axios.post(' https://ojus-server-132kgu2rdjqbfc.herokuapp.com/check_like',data,config)
        axios.post('http://localhost:2000/comment_check_like',data,config)
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
            data.id = this.props.comment._id;
            axios.post('http://localhost:2000/comment_like',data,config)
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
        axios.post('http://localhost:2000/comment_unlike',data,config)
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


componentWillMount()
{
    this.checkIfLiked();
}

    fetchCommentUser()
    {
       if(this.state.commentLoading)
       {

       var user_id= this.props.comment.author.id;
       const config = {
        headers: {
            'content-type': 'application/json'
        },
        withCredentials: true, // default

    };
    // console.log(this.props.comment.author.team)
    if(this.props.comment.author.team)
    {
        alert('team');
        axios.post('http://localhost:2000/fetch_team_details',{user_id},config)
        // axios.post(' https://ojus-server-132kgu2rdjqbfc.herokuapp.com/fetch_comments',data,config)
        .then((response)=>{
            // console.log(response.data);
            this.setState({commentUserData:response.data},()=>{this.setState({commentLoading:false})})

        
        })

    }
    else{
        alert('member');
        axios.post('http://localhost:2000/fetch_member_details',{user_id},config)
        // axios.post(' https://ojus-server-132kgu2rdjqbfc.herokuapp.com/fetch_comments',data,config)
        .then((response)=>{
            // console.log(response.data);
            this.setState({commentUserData:response.data},()=>{this.setState({commentLoading:false})})
        
        })
    }
}
else{
return(
    
    <div className="job-status-bar" style={{marginLeft:-10, marginBottom:-40}}>
        <div>
    <img style={{height:45, width:45, float:'left', borderRadius: '50%'}} src={this.state.commentUserData[0].profilePhoto} alt />
    <div class="shadow-none p-3 mb-5 bg-light rounded" style={{ float:'left',width:'80%'}}>

        <p><a style={{marginRight:5}}  href="#">{this.props.comment.author.team==true?this.state.commentUserData[0].team_name:this.state.commentUserData[0].name}</a>
        {this.props.comment.comment}</p>
        </div>
    </div>
<div  className="job-status-bar" style={{marginTop:-60}}>
<div style={{float:'left', marginLeft:30}}>
            <a  onClick={this.toggleLike}  style={{color:this.state.liked?'blue':'#000'}} >Upvote {this.state.likes.length}</a>
            {this.fetchLikes()}
        </div>
    <div style={{float:'left', marginLeft:30}}>
            <a onClick={()=>{this.setState({repliesToggle:true})}}>Reply</a>
        </div>
        </div>
        <div id="reply"  className="job-status-bar" style={{display:this.state.repliesToggle?'block':'none'}} className="job-status-bar">
        <div  className="job-status-bar"  id="reply-sections" style={{width:'100%', padding:10, marginTop:-44, marginBottom:-35}}>
        <img style={{height:45, width:45, float:'left', borderRadius: '50%'}} src={this.props.profilePhoto} alt />
            <form  style={{float:'left', width:'80%', marginLeft:'1.5%', marginTop:2}} onSubmit={this.postReply}>

            <div className="input-group mb-3" >

            <input  type="reply" onChange={this.OnReplyChange} name="reply" value={this.state.reply} className="form-control" placeholder="Write reply" aria-label="reply" aria-describedby="basic-addon1" />
            </div>
            </form>
            </div>
            <div>
            {this.fetchReplies()}
            </div>

        </div>
    </div>
)

}
   }

   fetchReplies()
    {

        if(this.state.repliesLoading)
        {
            var data ={}
            var comment_id = this.props.comment._id;
            data.comment_id = comment_id;
            const config = {
                headers: {
                    'content-type': 'application/json'
                },
                withCredentials: true, // default

            };
            var list;

            axios.post('http://localhost:2000/fetch_replies',data,config)
            // axios.post(' https://ojus-server-132kgu2rdjqbfc.herokuapp.com/fetch_comments',data,config)
            .then((response)=>{
                // console.log(response.data);
                this.setState({replies:response.data},()=>{this.setState({repliesLoading:false})})
            
            })
    }
    else{

        list = this.state.replies.map(function(item)
        {
            return(
                <Reply  key={item._id} reply={item} />
            )
        })

        return list;


    }
    }

        OnReplyChange(event)
        {
            event.preventDefault();
            this.setState({
                [event.target.name] : event.target.value,
              })
    
              console.log(event.target.value);
        }

        postReply(event)
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
            data._id = this.props.comment._id;   //comment id
            data.reply = this.state.reply; // comment
    
            axios.post('http://localhost:2000/post_reply',data,config)
            // axios.post(' https://ojus-server-132kgu2rdjqbfc.herokuapp.com/post_comment',data,config)
            .then((response)=>{
            //    console.log(response.data);
                var replies  =this.state.replies;
                replies.unshift(response.data);
                this.setState({replies:replies}, ()=>{
                    this.setState({reply:''})
                });
    
            })
            .catch((error)=>{
                throw error;
            })
    
    
    
        }

    render()
    {
        return(
            <div id="single-comment">
                     {this.fetchCommentUser()}
                 
                </div>
            
        )
    }
}