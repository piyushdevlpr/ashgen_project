import React, { Component } from 'react';
import './Chat.css'
import './assets/css/animate.css'
import './assets/css/bootstrap.min.css'
import './assets/css/flatpickr.min.css'
import './assets/css/font-awesome.min.css'
import './assets/css/jquery.range.css'
import './assets/css/line-awesome.css'
import './assets/css/line-awesome-font-awesome.min.css'
import './assets/css/responsive.css'
import './assets/css/style.css'


export default class ChatText extends Component{

    render()
    {
        return(
            // <span>
                this.props.data.from === this.props.user ?
                    (
                    <div class="outgoing_msg">
                        <div class="sent_msg">
                        <p>{this.props.data.data.message}</p>
                        </div>
                    </div>
                    
                   
                    //   <div class="message sent">
                    //     <p>{this.props.data.data.message}</p>
                    //     {/* <span class="metadata">
                    //         <span class="time"></span>
                    //     </span> */}
                    //   </div>
                    
                    )
                    :
                    (
                    <div class="incoming_msg">
                        <div class="received_msg">
                            {/* <div class="received_withd_msg"> */}
                                <p>{this.props.data.data.message}</p>   
                            {/* </div> */}
                        </div>
                    </div>
                //     <div class="message received">
                //   <p>{this.props.data.data.message}</p>
                //   {/* <span class="metadata"><span class="time"></span></span> */}
                // </div>
                    )
                // </span>
        )
    }
}