import React, { Component } from 'react';
import axios from 'axios';

export default class Reply extends Component{
    constructor(props){
        super(props) ;
        this.state = {
           replyUserData:null,
           replyLoading:true

        }
     
    
    }

    fetchReplyUser()
    {
       if(this.state.replyLoading)
       {

       var user_id= this.props.reply.author.id;
       const config = {
        headers: {
            'content-type': 'application/json'
        },
        withCredentials: true, // default

    };
    // console.log(this.props.comment.author.team)
    if(this.props.reply.author.team)
    {
        axios.post('http://localhost:2000/fetch_team_details',{user_id},config)
        // axios.post(' https://ojus-server-132kgu2rdjqbfc.herokuapp.com/fetch_comments',data,config)
        .then((response)=>{
            // console.log(response.data);
            this.setState({replyUserData:response.data},()=>{this.setState({replyLoading:false})})

        
        })

    }
    else{
        axios.post('http://localhost:2000/fetch_member_details',{user_id},config)
        // axios.post(' https://ojus-server-132kgu2rdjqbfc.herokuapp.com/fetch_comments',data,config)
        .then((response)=>{
            // console.log(response.data);
            this.setState({replyUserData:response.data},()=>{this.setState({replyLoading:false})})
        
        })
    }
}
else{
return(
    
    <div className="job-status-bar" style={{marginLeft:-21, marginBottom:-48}}>
        <div>
    <img style={{height:45, width:45, float:'left', borderRadius: '50%'}} src={this.state.replyUserData[0].profilePhoto} alt />
    <div class="shadow-none p-3 mb-5 bg-light rounded" style={{ float:'left',width:'80%'}}>

        <p><a style={{marginRight:5}}  href="#">{this.props.reply.author.team==true?this.state.replyUserData[0].team_name:this.state.replyUserData[0].name}</a>
        {this.props.reply.reply}</p>
        </div>
    </div>
<div  className="job-status-bar" style={{marginTop:-60}}>
<div style={{float:'left', marginLeft:30}}>
            <a>Like</a>
        </div>
    <div style={{float:'left', marginLeft:30}}>
            <a>Reply</a>
        </div>
        </div>
    </div>
)

}
   }

    
    render()
    {
        return(
            <div className="job-status-bar" style={{marginLeft:-10}}>
                <div>

                </div>
                <div>
            {this.fetchReplyUser()}
            </div>
        </div>
        )
    }
}