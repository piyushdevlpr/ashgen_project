import React, { Component } from 'react';
import socketIOClient from "socket.io-client";

const axios = require("axios");


export default class ChatVideo extends Component{
    getfilename(){
        var name = this.props.data.data.url ;
        // console.log(name.split('/')[5]) ;
        var x = name.split('/')[5];
        var y = x.substring(13);
        var z = y.substring(0,y.length - 5);
        // console.log(z) ;
        var c = z.split("%20") ;
        var str ="" ;
        for(var i = 0 ; i < c.length ; i++){
            str = str + c[i] + " ";
        }
        console.log(str) ;
        return str ;
    }
    render()
    {
        console.log('video');
        return(
<div>
{this.props.data.from === this.props.user ?
    (
        <span>
    <div class="outgoing_msg">
        <div class="sent_msg">
        <p><a href={this.props.data.data.url}>{this.getfilename()}</a></p>
        </div>
    </div>             
        <div class="outgoing_msg">
        <div class="sent_msg">
            <p>{this.props.data.data.message}</p>
        </div>
    </div>     
    </span>        
)
    :
    (
        <span>
     <div class="incoming_msg">
         <div class="received_msg">
         <p><a href={this.props.data.data.url}>{this.getfilename()}</a></p>
         </div>
     </div>
     <div class="incoming_msg">
     <div class="received_msg">
         <p>{this.props.data.data.message}</p>   
     </div>
    </div>
    </span>
     )
    }
    </div>    
        )
    }
}