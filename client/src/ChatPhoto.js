import React, { Component } from 'react';
import socketIOClient from "socket.io-client";

const axios = require("axios");


export default class ChatPhoto extends Component{

    render()
    {
        console.log('photo');
        return(
            <div>
                <p>{this.props.data.from}</p>
                <img src="https://envato-shoebox-0.imgix.net/4646/3935-85f4-41a0-b940-708875ee0a15/tajak+019.jpg?w=500&h=278&fit=crop&crop=edges&auto=compress%2Cformat&s=c45335aca948555287bc4229b1632950" alt="..." class="img-thumbnail" />
                <p>{this.props.data.data.message}</p>
                </div>
        )
    }
}