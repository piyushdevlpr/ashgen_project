import React, { Component } from 'react';


export default class Comment extends Component{

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
                    <a href="#" style={{marginRight:10}}>Like</a>
                    <a href="#">Reply</a>
                </div>
        
            </div>

        )
    }
}