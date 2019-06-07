import React, { Component } from 'react';
import socketIOClient from "socket.io-client";

const axios = require("axios");


export default class ChatVideo extends Component{

    render()
    {
        console.log('video');
        return(
<div>
{this.props.data.from === this.props.user ?
    (
    // <div class="outgoing_msg">
    //     <div class="sent_msg">
    //     <img src="https://envato-shoebox-0.imgix.net/4646/3935-85f4-41a0-b940-708875ee0a15/tajak+019.jpg?w=500&h=278&fit=crop&crop=edges&auto=compress%2Cformat&s=c45335aca948555287bc4229b1632950" alt="..." class="img-thumbnail" />
    //         <p>{this.props.data.data.message}</p>
    //     </div>
    // </div>
    <div class="main-message-box st3">
                        <div class="message-dt st3">
                            <div class="message-inner-dt">
                       
                <div className="embed-responsive embed-responsive-16by9">
            <iframe className="embed-responsive-item" src="https://www.youtube.com/embed/zpOULjyy-n8?rel=0"></iframe>
            </div>
            <p>{this.props.data.data.message}</p>
                
                            </div>
                            {/* <!--message-inner-dt end--> */}
                            {/* <span>5 minutes ago</span> */}
                        </div>
                        {/* <!--message-dt end--> */}
                        {/* <div class="messg-usr-img">
                            <img src="images/resources/m-img1.png" alt=""/>
                        </div> */}
                        {/* <!--messg-usr-img end--> */}
                        {/* <!--main-message-box end--> */}
                    </div>
    )
    :
    (
    // <div class="incoming_msg">
    //     <div class="received_msg">
    //         <div class="received_withd_msg">
    //         <img src="https://envato-shoebox-0.imgix.net/4646/3935-85f4-41a0-b940-708875ee0a15/tajak+019.jpg?w=500&h=278&fit=crop&crop=edges&auto=compress%2Cformat&s=c45335aca948555287bc4229b1632950" alt="..." class="img-thumbnail" />   
    //             <p>{this.props.data.data.message}</p>   
    //         </div>
    //     </div>
    // </div>
    <div class="main-message-box ta-right">
    <div class="message-dt">
    <div class="message-inner-dt">
                <div className="embed-responsive embed-responsive-16by9">
            <iframe className="embed-responsive-item" src="https://www.youtube.com/embed/zpOULjyy-n8?rel=0"></iframe>
            </div>
            <p>{this.props.data.data.message}</p>
    </div>
        {/* <!--message-inner-dt end--> */}
        {/* <span>Sat, Aug 23, 1:08 PM</span> */}
    </div>
    {/* <!--message-dt end--> */}
    {/* <div class="messg-usr-img">
        <img src="images/resources/m-img2.png" alt=""/>
    </div> */}
        {/* <!--messg-usr-img end--> */}
        {/* <!--main-message-box end--> */}
        </div>    
     )
    }
    </div>    
        )
    }
}