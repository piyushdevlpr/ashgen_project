import React, { Component } from 'react';
const axios = require("axios");

export default class ChatFile extends Component{

render()
    {
        return(
            <div>
                {this.props.data.from === this.props.user ?
                (
                <span>
                <div class="outgoing_msg">
                    <div class="sent_msg">
                        <p><a href={this.props.data.data.url} download>file</a></p>
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
                        <p><a href={this.props.data.data.url} download>file</a></p>
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