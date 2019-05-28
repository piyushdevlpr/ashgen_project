import React, { Component } from 'react';
const axios = require("axios");

 class PhotoList extends Component{
   
_isMounted = true;

    constructor(props){
        super(props) ;
        this.state = {
           comment:'',   //user can write comment
           like:false,
           item : this.props.item,
           comments: [],          //posts comments
           likes: [],           //list of post likes
           commentLoad : false,
           likeLoad    : false,
           likeInfo : {}, // if user liked the post then LikeSchema will be stored here

           
        }
        this.postComment = this.postComment.bind(this);
        this.OnCommentChange  = this.OnCommentChange.bind(this);
        this.fetchComments  = this.fetchComments.bind(this);
        this.toggleLike = this.toggleLike.bind(this);
        this.fetchLikes = this.fetchLikes.bind(this);
        this.checkIfLiked = this.checkIfLiked.bind(this);
        this.fetchShare   = this.fetchShare.bind(this);
        this.postShare = this.postShare.bind(this);
       
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
                this.setState({like:true});
                this.setState({likeInfo:response.data.likeInfo});
            }

        })
        .catch((err)=>{
            throw err;
        })


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

    OnCommentChange(event)
    {
        event.preventDefault();
        this.setState({
            [event.target.name] : event.target.value,
          })

          console.log(event.target.value);
    }

    fetchComments()
    {

        if(!this.state.commentLoad)
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
                this.setState({comments:response.data},()=>{this.setState({commentLoad:true})})
            
            })
    }
    else{

        list = this.state.comments.map(function(item)
        {
            return(
                <div key={item._id}>
                    <h5>comment by {item.author.username}</h5>
                    <p>{item.comment}</p>
                </div>
            )
        })

        return list;


    }
    }

    fetchLikes()
    {
       if(!this.state.likeLoad)
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
            this.setState({likes:response.data},()=>{this.setState({likeLoad:true})})
        
        })
       }
       else{

        list = this.state.likes.map(function(item)
        {
            return(
                <div key={item._id}>
                    <p>{item.author.username}</p>
                </div>
            )
        })

        return list;

       }
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
            data.id = this.state.item._id;
            axios.post('http://localhost:2000/post_like',data,config)
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
        axios.post('http://localhost:2000/un_like',data,config)
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


    postShare(event)
    {   
        event.preventDefault();
        const config = {
            headers: {
                'content-type': 'application/json'
            },
            withCredentials: true, // default

        };
        var post_id = this.state.item._id;
        var data = {};
        data.post_id = post_id;
        axios.post('http://localhost:2000/post_share',data,config)
        // axios.post(' https://ojus-server-132kgu2rdjqbfc.herokuapp.com/post_share',data,config)
        .then((response)=>{
            console.log(response.data);

        })
        .catch((err)=>{
            throw err;
        })


    }


    fetchShare()
    {

    }


    render()
    {
        
        return(
            <div className="container">
            <div className="jumbotron">
            <div>
                <p>{this.state.item.author.username}</p>
            </div>
            <div>
                <p>{this.state.item.desc}</p>
            </div>
            <div className="post-image">
            <img src="https://envato-shoebox-0.imgix.net/4646/3935-85f4-41a0-b940-708875ee0a15/tajak+019.jpg?w=500&h=278&fit=crop&crop=edges&auto=compress%2Cformat&s=c45335aca948555287bc4229b1632950" alt="..." className="img-thumbnail" />
            </div>
            <div className="like-button">
            <button style={{backgroundColor:this.state.like?'red':'#fff'}} onClick={this.toggleLike}     type="button" className="btn btn-light">Like</button>
            <p>Liked by</p>
            <div>
                {this.fetchLikes()}
            </div>
            </div>

            <div className="share-button">
            <button type="button" onClick={this.postShare} className="btn btn-danger">Share</button>
            <p>Shared by</p>
            <div>
                {this.fetchShare()}
            </div>
            </div>
            <div className="comment">
                <form onSubmit={this.postComment}>
                <div className="form-group" >
                <input type="comment" onChange={this.OnCommentChange} name="comment" value={this.state.comment} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Comment" />
                </div>
                <button type="submit" className="btn btn-primary">Comment</button>
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

export default PhotoList;