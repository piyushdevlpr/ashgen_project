import React, { Component } from 'react';
import socketIOClient from "socket.io-client";

const axios = require("axios");


export default class ChatPhoto extends Component{

    render()
    {
        return(
            <p>{this.props.children}</p>
        )
    }
}