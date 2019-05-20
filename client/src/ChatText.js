import React, { Component } from 'react';
import socketIOClient from "socket.io-client";



export default class ChatText extends Component{

    render()
    {
        return(
            <div>
                <li>{this.props.data.from} : {this.props.data.data.message}</li>
            </div>

        )
    }
}