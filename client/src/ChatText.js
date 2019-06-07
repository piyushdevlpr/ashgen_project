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
                    // <div className="ta-right">
					// 					<div className="message-dt">
					// 						<div className="message-inner-dt">
                    //                             <p>{this.props.data.data.message}</p>
					// 						</div>
					// 						<span>5 minutes ago</span>
					// 					</div>
					// 					 <div className="messg-usr-img"> 
					// 						<img src="images/resources/m-img1.png" alt=""/>
					// 					</div> 
                    //                 </div>
                    )
                    :
                    (
                    <div class="incoming_msg">
                        <div class="received_msg">
                            <div class="received_withd_msg">
                                <p>{this.props.data.data.message}</p>   
                            </div>
                        </div>
                    </div>
                    // <div className="main-message-box st3">
                    // <div className="message-dt st3">
                    // <div className="message-inner-dt">
                    //                            <p>{this.props.data.data.message}</p>
					// </div>
                    //     <span>Sat, Aug 23, 1:08 PM</span>
                    // </div>
                    // <div className="messg-usr-img">
                    //     <img src="images/resources/m-img2.png" alt=""/>
                    // </div>
                    // </div>    
                    )
                // </span>
        )
    }
}