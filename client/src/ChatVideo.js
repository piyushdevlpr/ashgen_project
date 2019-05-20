import React, { Component } from 'react';
import socketIOClient from "socket.io-client";

const axios = require("axios");


export default class ChatVideo extends Component{

    render()
    {
        console.log('video');
        return(
            <div>
                <p>{this.props.data.from}</p>
                <div className="embed-responsive embed-responsive-16by9">
            <iframe className="embed-responsive-item" src="https://www.youtube.com/embed/zpOULjyy-n8?rel=0"></iframe>
            </div>
            <p>{this.props.data.data.message}</p>
                </div>
        )
    }
}