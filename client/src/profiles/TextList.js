import React, { Component } from 'react';
import axios from 'axios';

export default class TextList extends Component{
    render()
    {
        return(
            <div className="post-bar">
                                  <div className="post_topbar">
                                    <div className="usy-dt">
                                      <img style={{height:50, width:50}} src={this.props.profilePhoto} alt />
                                      <div className="usy-name">
                                        <h3>{this.props.teamData.team_name}</h3>
                                        <span><img src="../assets/images/clock.png" alt />3 min ago</span>
                                      </div>
                                    </div>
                                    <div className="ed-opts">
                                      <a href="#" title className="ed-opts-open"><i className="la la-ellipsis-v" /></a>
                                      <ul className="ed-options">
                                        <li><a href="#" title>Edit Post</a></li>
                                        <li><a href="#" title>Unsaved</a></li>
                                        <li><a href="#" title>Unbid</a></li>
                                        <li><a href="#" title>Close</a></li>
                                        <li><a href="#" title>Hide</a></li>
                                      </ul>
                                    </div>
                                  </div>
                                  <div className="epi-sec">
                                    <ul className="descp">
                                      <li><img src="../assets/images/icon8.png" alt /><span>Front End Developer</span></li>
                                      <li><img src="../assets/images/icon9.png" alt /><span>India</span></li>
                                    </ul>
                                    <ul className="bk-links">
                                      <li><a href="#" title><i className="la la-bookmark" /></a></li>
                                      <li><a href="#" title><i className="la la-envelope" /></a></li>
                                      <li><a href="#" title className="bid_now">Bid Now</a></li>
                                    </ul>
                                  </div>
                                  <div className="job_descp">
                                    {/* <h3>Simple Classified Site</h3>
                                    <ul className="job-dt">
                                      <li><span>$300 - $350</span></li>
                                    </ul> */}
                                    <p>{this.props.item.desc}</p>
                                    {/* <ul className="skill-tags">
                                      <li><a href="#" title>HTML</a></li>
                                      <li><a href="#" title>PHP</a></li>
                                      <li><a href="#" title>CSS</a></li>
                                      <li><a href="#" title>Javascript</a></li>
                                      <li><a href="#" title>Wordpress</a></li> 	
                                    </ul> */}
                                  </div>
                                  <div className="job-status-bar">
                                    <ul className="like-com">
                                      <li>
                                        <a href="#"><i className="la la-heart" /> Like</a>
                                        <img src="../assets/images/liked-img.png" alt />
                                        <span>25</span>
                                      </li> 
                                      <li><a href="#" title className="com"><img src="../assets/images/com.png" alt /> Comment 15</a></li>
                                    </ul>
                                    <a><i className="la la-eye" />Views 50</a>
                                  </div>
                                </div>

        )
    }
}