import React, { Component } from 'react';
const axios = require("axios");

 class PhotoList extends Component{
   
_isMounted = true;

    constructor(props){
        super(props) ;
        this.state = {
           comment:'',
           like:false,
           item : this.props.item,
           
        }
        this.postComment = this.postComment.bind(this);
        this.OnCommentChange  = this.OnCommentChange.bind(this);
        this.fetchComments  = this.fetchComments.bind(this);
        this.toggleLike = this.toggleLike.bind(this);
        this.fetchLikes = this.fetchLikes.bind(this);
        
       
    }

    componentWillMount()
    {
        this._isMounted = true;
    }
    componentWillUnmount()
    {
        this._isMounted = false;
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
        data._id = this.state.item._id;
        data.comment = this.state.comment;

        axios.post('http://localhost:2000/post_comment',data,config)
        .then((response)=>{
            console.log(response.data.comments);
            var item = this.state.item;
            item.comments = response.data.comments;
            // console.log(item.comments);
            this.setState({item:item});
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
        var list = this.state.item.comments.map(function(item){
            return(
                <div key={item._id}>
                    <h5>{item.author.user}</h5>
                    <p>{item.comment}</p>
                    <hr />
                 </div>
            )
        })
        return list;
    }

    fetchLikes()
    {
        var list = this.state.item.likes.map(function(item){
            return(
                <div key={item._id}>
                    <p>{item.author.user}</p>
                 </div>
            )
        })
        return list;
    }

    toggleLike(event)
    {
        console.log('hello');
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
            .then((response)=>{

                this.setState({like:true});
                var item = this.state.item;
                item.likes = response.data.likes;
                this.setState({item:item});
            
            })
            .catch((error)=>{
                throw error;
            })

    }
    else{
        var  data = {};
        data.id = this.state.item._id;
        console.log(data.id);
        axios.delete('http://localhost:2000/post_like',data)
        .then((response)=>{
            
            this.setState({like:false});
            var item = this.state.item;
            item.likes = response.data.likes;
            console.log(item.likes);
            this.setState({item:item});
        
        })
        .catch((error)=>{
            throw error;
        })


    }
        

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