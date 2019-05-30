import React, { Component } from 'react';
import axios from 'axios';
import Reply from './Reply';

export default class Comment extends Component{

        ismounted = true ;
        constructor(props){
            super(props) ;
            this.state = {
                reply:'',  //user can reply to comment
                replies:[],  // contains all replies to comment
                replyLoad: false, //if -->false replies not loaded
                like : false,
                likeInfo:{},
                likes: [],           //list of post likes
                likeLoad: false,  //iif-->false likes not loaded




            }

            this.OnReplyChange = this.OnReplyChange.bind(this);
            this.postReply   = this.postReply.bind(this);
            this.fetchReplies  = this.fetchReplies.bind(this);
            this.checkIfLiked = this.checkIfLiked.bind(this);
            this.fetchLikes   = this.fetchLikes.bind(this);
            this.toggleLike  = this.toggleLike.bind(this);
        
        }

        componentWillMount()
        {
            this._isMounted = true;
            this.checkIfLiked();

        }
    componentWillUnmount()
        {
            this._isMounted = false;

        }
        fetchLikes()
        {
        if(!this.state.likeLoad)
        {
            var data ={}
            var comment_id = this.props.item._id;
            data.comment_id = comment_id;
            const config = {
                headers: {
                    'content-type': 'application/json'
                },
                withCredentials: true, // default

            };
            var list;

            axios.post('http://localhost:2000/comment_fetch_likes',data,config)
            // axios.post(' https://ojus-server-132kgu2rdjqbfc.herokuapp.com/fetch_likes',data,config)
            .then((response)=>{
                // console.log(response.data);
                this.setState({likes:response.data},()=>{this.setState({likeLoad:true})})
            
            })
        }
        //    else{

        //     list = this.state.likes.map(function(item)
        //     {
        //         return(
        //             <div style={{display:'inline', marginRight:'5px'}} key={item._id}>
        //                 <p style={{display:'inline'}}>{item.author.username}</p>
        //             </div>
        //         )
        //     })

        //     return list;

        //    }
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
            data.comment_id = this.props.comment_id;
            // axios.post(' https://ojus-server-132kgu2rdjqbfc.herokuapp.com/check_like',data,config)
            axios.post('http://localhost:2000/comment_check_like',data,config)
            .then((response)=>{
    
                if(response.data.check==true)
                {
                    this.setState({like:true});
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
            if(!this.state.like)
            {
                var  data = {};
                data.id = this.props.item._id;
                axios.post('http://localhost:2000/comment_like',data,config)
                // axios.post(' https://ojus-server-132kgu2rdjqbfc.herokuapp.com/post_like',data,config)
                .then((response)=>{
    
                    var likes  =this.state.likes;
                    likes.unshift(response.data);
                    this.setState({likes:likes}, ()=>{
                        this.setState({like:true});
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
                
                    this.setState({like:false});
                    this.setState({likeLoad:false})
            })
            .catch((error)=>{
                throw error;
            })
    
    
        }
            
    
        }





        fetchReplies()
    {

        if(!this.state.replyLoad)
        {
            var data ={}
            var comment_id = this.props.item._id;
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
                this.setState({replies:response.data},()=>{this.setState({replyLoad:true})})
            
            })
    }
    else{

        list = this.state.replies.map(function(item)
        {
            return(
                <Reply  key={item._id} item={item} />
                
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
            data._id = this.props.item._id;   //comment id
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
            <div style={{padding:"10px 5px", borderBottomWidth:'10px', borderBottomColor:'black'}}>
                    <div>
                <img style={{display:'inline', height:30,width:30, marginRight:'20px' }} src="https://envato-shoebox-0.imgix.net/4646/3935-85f4-41a0-b940-708875ee0a15/tajak+019.jpg?w=500&h=278&fit=crop&crop=edges&auto=compress%2Cformat&s=c45335aca948555287bc4229b1632950" alt="..." class="rounded-circle" />

                <p style={{display:'inline'}}>{this.props.item.author.username}</p>
                <p style={{display:'inline', marginLeft:'20px'}}>{this.props.item.comment}</p>

                </div>
                <div style={{float:'right', marginRight:50}}>
                    <a onClick={this.toggleLike} style={{color:this.state.like?'blue':'#000', marginRight:10}}>Like {this.state.likes.length}</a>
                    <a >Reply</a>
                    <div id="reply">
                <form onSubmit={this.postReply}>
                <div className="input-group mb-3" >
             
                <input style={{ width:'100%'}}  type="reply" onChange={this.OnReplyChange} name="reply" value={this.state.reply} className="form-control" placeholder="Write comment" aria-label="comment" aria-describedby="basic-addon1" />
                </div>
                </form>

                <div>
                {this.fetchReplies()}
                {this.fetchLikes()}
                </div>

                </div>
                </div>
        
            </div>

        )
    }
}