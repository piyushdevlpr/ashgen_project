import React, { Component } from 'react';
import './Chat.css'



export default class ChatText extends Component{

    render()
    {
        return(
            <div>
                {this.props.data.from === this.props.user ?
                    (<div class="outgoing_msg">
                        <div class="sent_msg">
                            <p>{this.props.data.data.message}</p>
                        </div>
                    </div>
                    )
                    :
                    (<div class="incoming_msg">
                        <div class="received_msg">
                            <div class="received_withd_msg">
                                <p>{this.props.data.data.message}</p>   
                            </div>
                        </div>
                    </div>    
                    )
                }
                </div>
        )
    }
}