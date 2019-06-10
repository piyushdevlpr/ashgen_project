import React, { Component } from 'react';
import socketIOClient from "socket.io-client";

const axios = require("axios");


export default class ChatPhoto extends Component{
    constructor(props){
        super(props) ;
        this.state = {
            loading : false ,
            loaded : false ,
        }
        this.getImage = this.getImage.bind(this) ;
    }
    getImage=(e)=>{
        e.preventDefault() ;
        this.setState({loading : true })
    }
    makeloadedtrue=()=>{
        // e.preventDefault() ;
        this.setState({loaded : true , loading:false})
    }
    render()
    {
        console.log('photo');
        return(
                <div>
                {this.props.data.from === this.props.user ?
                    (
                        <span>
                    <div class="outgoing_msg">
                        <div class="sent_msg">
                        <div className="posrel">
                        {/* <div> */}
                        {this.state.loading || this.state.loaded
                        ?<img  src="https://cdn1.goibibo.com/t_tg_fs/new-delhi-india-gate-147623366844-orijgp.jpg" onLoad={this.makeloadedtrue} alt="..." class="img-thumbnail" />
                          
                        :<img  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQUxPpo4PyDKi49cPqaV03_7InMkEBjKcOd5CVB4n4DNdH7jk2Bg" alt="..." class="img-thumbnail" />
                        
                        }
                        {(!this.state.loading && !this.state.loaded) ? <button className="buttn" onClick={this.getImage}>D</button>
                        : (this.state.loading) ? <div className="buttn">...</div>
                        :null  
                        } 
                        {console.log(this.state)}                       
                    {/* <img src={"C:\Users\piyush\Desktop\ashgen_project\server\public\uploads\chat\"} + this.prop.data.data.url.slice(21) alt="..." class="img-thumbnail" />  */}
                          
                            </div>
                        </div>
                    </div>
                    
                    <div class="outgoing_msg">
                    <div class="sent_msg">
                    
                       <p>{this.props.data.data.message}</p>
                        </div>
                    </div>
                    </span>
                    // <div class="main-message-box st3">
					// 					<div class="message-dt st3">
					// 						<div class="message-inner-dt img-bx">
                    //                         <img src="https://envato-shoebox-0.imgix.net/4646/3935-85f4-41a0-b940-708875ee0a15/tajak+019.jpg?w=500&h=278&fit=crop&crop=edges&auto=compress%2Cformat&s=c45335aca948555287bc4229b1632950" alt="..." class="img-thumbnail" />
                    //                             {/* <p>{this.props.data.data.message}</p> */}
					// 						</div>
                    //                         <div class="message-inner-dt">
                    //                         {/* <img src="https://envato-shoebox-0.imgix.net/4646/3935-85f4-41a0-b940-708875ee0a15/tajak+019.jpg?w=500&h=278&fit=crop&crop=edges&auto=compress%2Cformat&s=c45335aca948555287bc4229b1632950" alt="..." class="img-thumbnail" /> */}
                    //                             <p>{this.props.data.data.message}</p>
					// 						</div>
                    //                         {/* <!--message-inner-dt end--> */}
					// 						{/* <span>5 minutes ago</span> */}
					// 					</div>
                    //                     {/* <!--message-dt end--> */}
					// 					{/* <div class="messg-usr-img">
					// 						<img src="images/resources/m-img1.png" alt=""/>
					// 					</div> */}
                    //                     {/* <!--messg-usr-img end--> */}
					// 				    {/* <!--main-message-box end--> */}
                    //                 </div>
                    )
                    :
                    (
           <span>
           <div class="incoming_msg">
                        <div class="received_msg">
                            <div class="received_withd_msg">
                            <div className="posrel">
                        {/* <div> */}
                        {this.state.loading || this.state.loaded
                        ?<img  src="https://cdn1.goibibo.com/t_tg_fs/new-delhi-india-gate-147623366844-orijgp.jpg" onLoad={this.makeloadedtrue} alt="..." class="img-thumbnail" />
                          
                        :<img  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQUxPpo4PyDKi49cPqaV03_7InMkEBjKcOd5CVB4n4DNdH7jk2Bg" alt="..." class="img-thumbnail" />
                        
                        }
                        {(!this.state.loading && !this.state.loaded) ? <button className="buttn" onClick={this.getImage}>D</button>
                        : (this.state.loading) ? <div className="buttn">...</div>
                        :null  
                        } 
                        {console.log(this.state)}                       
                        {/* <img src={"C:\Users\piyush\Desktop\ashgen_project\server\public\uploads\chat\"} + this.prop.data.data.url.slice(21) alt="..." class="img-thumbnail" />  */}
                          
                            </div>
   
                            </div>
                        </div>
                    </div>
                    
                    <div class="incoming_msg">
                        <div class="received_msg">
                            <div class="received_withd_msg">
                            <p>{this.props.data.data.message}</p>
    </div>
    </div>
    </div>
    </span>                
                    // <div class="ta-right">
                    // <div class="message-dt">
                    // <div class="message-inner-dt img-bx-sent">
                    //                         <img src="https://envato-shoebox-0.imgix.net/4646/3935-85f4-41a0-b940-708875ee0a15/tajak+019.jpg?w=500&h=278&fit=crop&crop=edges&auto=compress%2Cformat&s=c45335aca948555287bc4229b1632950" alt="..." class="img-thumbnail" />
                    //                             {/* <p>{tchis.props.data.data.message}</p> */}
					// 						</div>
                    //                         <div class="message-inner-dt">
                    //                         {/* <img src="https://envato-shoebox-0.imgix.net/4646/3935-85f4-41a0-b940-708875ee0a15/tajak+019.jpg?w=500&h=278&fit=crop&crop=edges&auto=compress%2Cformat&s=c45335aca948555287bc4229b1632950" alt="..." class="img-thumbnail" /> */}
                    //                             <p>{this.props.data.data.message}</p>
					// 						</div>
                    //     <span>Sat, Aug 23, 1:08 PM</span>
                    // </div>
                    //  <div class="messg-usr-img">
                    //     <img src="images/resources/m-img2.png" alt=""/>
                    // </div>
                    // </div>   
                    )
                }
                </div>
        )
    }
}