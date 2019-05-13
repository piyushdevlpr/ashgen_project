import React, { Component } from 'react';
const axios = require("axios");


 class TextList extends Component{

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


    render()
    {
        return(
            <div className="container">
            <div className="jumbotron">
            <div>
                <p>{this.props.item.author.username}</p>
            </div>
            <div>
                <p>{this.props.item.desc}</p>
            </div>
            <div className="like-button">
            <button type="button" className="btn btn-light">Like</button>
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

export default TextList;