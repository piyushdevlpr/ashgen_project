import React, { Component } from 'react';
import axios from 'axios';
//Css file import
import AddMemberForm from './AddMemberForm';
import '../assets/css/animate.css'
import '../assets/css/bootstrap.min.css'
import '../assets/css/flatpickr.min.css'
import '../assets/css/font-awesome.min.css'
import '../assets/css/jquery.range.css'
import '../assets/css/line-awesome.css'
import '../assets/css/line-awesome-font-awesome.min.css'
import '../assets/css/responsive.css'
import '../assets/css/style.css'
import {Modal,Form,Button,Col,Row} from 'react-bootstrap'
import { resolveNaptr } from 'dns';
import PhotoList from './PhotoList';
import TextList from './TextList';
import VideoList from './VideoList';


export default class TeamProfile extends Component{

  ismounted = true ;
    constructor(props){
        super(props) ;
        this.state = {
            teamData:null,
            loading: true,    //true----> in loading state
            feed:true,
            about:false,
            portfolio:false,
            members:false,
            achievements:[],
            portfolioLoading: true,
            showAchievement: false,
            showProject: false,
            achievementTitle:'',
            achievementURL:'',
            achievementYear:'',
            achievementLoading:true,
            projectTitle:'',
            projectURL:'',
            projectYear:'',
            achievements:null,
            projects:null,
            projectLoading: true,
            profilePhoto: '',
            profileTimeline:'',
            profilePhotoUpload : null,
            profileTimelineUpload:null,
            posts: [],
            postLoading:true,
            
        }
        this.fetchProfile = this.fetchProfile.bind(this);
        this.middleContent = this.middleContent.bind(this);
        this.toggleMiddleContent = this.toggleMiddleContent.bind(this);
        this.handleShowAchievement = this.handleShowAchievement.bind(this);
      this.handleCloseAchievement = this.handleCloseAchievement.bind(this);
      this.addAchievement   = this.addAchievement.bind(this);
      this.OnInputChangeAchievement = this.OnInputChangeAchievement.bind(this);
      this.fetchAchievements = this.fetchAchievements.bind(this);
      this.handleShowProject = this.handleShowProject.bind(this);
      this.handleCloseProject = this.handleCloseProject.bind(this);
      this.addProject  = this.addProject.bind(this);
      this.OnInputChangeProject = this.OnInputChangeProject.bind(this);
      this.fetchProjects = this.fetchProjects.bind(this);
      this.profilePhotoHandle = this.profilePhotoHandle.bind(this);
      this.profileTimelineHandle = this.profileTimelineHandle.bind(this);
      this.fetchPosts  = this.fetchPosts.bind(this);

    }

    profileTimelineHandle(event)
    {
        event.preventDefault();
        this.setState({[event.target.name]: event.target.files[0]},
            ()=>{console.log(this.state.profileTimelineUpload)}
            );
    }

    profilePhotoHandle(event)
    {
        event.preventDefault();
        this.setState({[event.target.name]: event.target.files[0]},
          ()=>{
            const config = {
              headers: {
                'content-type': 'multipart/form-data'

              },      
              withCredentials: true, // default
          };
          var formData = new FormData();
          formData.append('profilePhotoUpload',this.state.profilePhotoUpload);
          formData.append('team_id',this.state.teamData._id)
          
          axios.post('http://localhost:2000/team/profile-photo',formData,config)
          .then((response)=>{
            console.log(response);
            this.setState({profilePhoto:response.data});
           
          })
          .catch((err)=>{throw err})
          }
            
            );
    }

    async fetchProfile()
    {
      

      await axios.get('http://localhost:2000/fetch_team_profile',{withCredentials: true}).then((response)=>{

      this.setState({teamData:response.data[0]},()=>{
        this.setState({profilePhoto:response.data[0].profilePhoto})
        this.setState({loading:false});
      });
      })
      .catch((err)=>{throw err})

    }
    handleCloseProject() {
      this.setState({ showProject: false });
    }
  
    handleShowProject() {
      this.setState({ showProject: true });
    }

    handleCloseAchievement() {
      this.setState({ showAchievement: false });
    }
  
    handleShowAchievement() {
      this.setState({ showAchievement: true });
    }
    OnInputChangeProject(event)
    {
        event.preventDefault();
        // console.log(this.state.event.target.name)
        this.setState({
            [event.target.name]: event.target.value,
          })

          
    }

    OnInputChangeAchievement(event)
    {
        event.preventDefault();
        // console.log(this.state.event.target.name)
        this.setState({
            [event.target.name]: event.target.value,
          })

          
    }
    addProject(e)
    {
      e.preventDefault();
      const config = {
        headers: {
            'content-type': 'application/json'
        },
        withCredentials: true, // default

    };
    var data = {
      "title":this.state.projectTitle,
      "url":this.state.projectURL,
      "year":this.state.projectYear,
    }
    axios.post('http://localhost:2000/team_project',data,config)
    .then((response)=>{
      this.setState({projectLoading:true});
      this.handleCloseProject();
     
    })
    .catch((err)=>{throw err})


    }

    addAchievement(e)
    {
      e.preventDefault();
      const config = {
        headers: {
            'content-type': 'application/json'
        },
        withCredentials: true, // default

    };
    var data = {
      "title":this.state.achievementTitle,
      "url":this.state.achievementURL,
      "year":this.state.achievementYear,
    }
    axios.post('http://localhost:2000/team_achievement',data,config)
    .then((response)=>{
      this.setState({achievementLoading:true});
      this.handleCloseAchievement();
     
    })
    .catch((err)=>{throw err})


    }

    fetchProjects()
    {
      
      if(this.state.projectLoading)
      {
        axios.get('http://localhost:2000/team_project',{withCredentials: true})
        .then((response)=>{this.setState({projects:response.data})
      
          this.setState({projectLoading:false});
      })
        .catch((err)=>{throw err})

      }
      else{
        var list = this.state.projects.map(function(item){

          return(
            <div id="projects">
          <ul className="list-group">
          <li className="list-group-item">Title: {item.title}</li>
          <li className="list-group-item">URL: {item.url}</li>
          <li className="list-group-item">Year:{item.year}</li>
          
      </ul>

        </div>
          )

        })

        return list;

      }

    
    }
    fetchAchievements()
    {
      
      if(this.state.achievementLoading)
      {
        axios.get('http://localhost:2000/team_achievement',{withCredentials: true})
        .then((response)=>{this.setState({achievements:response.data})
      
          this.setState({achievementLoading:false});
      })
        .catch((err)=>{throw err})

      }
      else{
        var list = this.state.achievements.map(function(item){

          return(
            <div id="achievements">
          <ul className="list-group">
          <li className="list-group-item">Title: {item.title}</li>
          <li className="list-group-item">URL: {item.url}</li>
          <li className="list-group-item">Year:{item.year}</li>
          
      </ul>

        </div>
          )

        })

        return list;

      }

    
    }
    fetchPosts()
    {
      axios.get('http://localhost:2000/team_posts',{withCredentials: true}).then((response)=>{
        // axios.get('https://ojus-server-132kgu2rdjqbfc.herokuapp.com/dashboard_posts').then((response)=>{
        // console.log(response);
            this.setState({posts:response.data},()=>{

                this.setState({postLoading:false})
                console.log(this.state.posts);

            });
            
        })


    }

    middleContent()
    {
      if(this.state.feed)
      {
        if(this.state.postLoading)
        {
          return(
            <div>
            {this.fetchPosts()}
            <p>Loading...</p>
            </div>
          )
        }
        else if(!this.state.loading){
          var teamData = this.state.teamData;
          var profilePhoto= this.state.profilePhoto;

          const list = this.state.posts.map(function(item)
           {
               if(item.type=='text')
               {
                   return(<TextList item={item} member={false} teamData={teamData} profilePhoto={profilePhoto} />)
               }
               else if(item.type=="photo")
               {
                return(<PhotoList item={item} member={false} teamData={teamData} profilePhoto={profilePhoto} />)

               }
               else{
                return(<VideoList item={item}  member={false} teamData={teamData} profilePhoto={profilePhoto} />)

               }
           })

           return list;
          
        }
      
      }
      else if(this.state.about)
      {
        return(
        <div id="about">
          <ul className="list-group">
          <li className="list-group-item">Field: {this.state.teamData.field}</li>
          <li className="list-group-item">Institude: {this.state.teamData.institute}</li>
          <li className="list-group-item">Establishment:{this.state.teamData.establishment}</li>
          
      </ul>

        </div>
        )
      }
    else if(this.state.portfolio)
    {
      return(
        <div id="portfolio" className="container">
          <div>
      <button type="button" onClick={this.handleShowAchievement} className="btn btn-danger">Add Achievement</button>
      </div>
      <div>
        {this.fetchAchievements()}
        </div>
      <div style={{marginTop:20}}>
        <button type="button" onClick={this.handleShowProject} className="btn btn-danger">Add Project</button>
        </div>
        <div>
          {this.fetchProjects()}
        </div>
        <div id="AchievementModal">
        <Modal show={this.state.showAchievement} onHide={this.handleCloseAchievement}>
          <Modal.Header closeButton>
            <Modal.Title>Add Achievement</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Form>
          <Form.Group as={Row} controlId="formPlaintextEmail">
        <Form.Label column sm="2">
          Title
        </Form.Label>
        <Col sm="10">
          <Form.Control name="achievementTitle" type="text" value={this.state.achievementTitle} onChange={this.OnInputChangeAchievement} placeholder="Title" />
        </Col>
      </Form.Group>
      <Form.Group as={Row} controlId="formPlaintextEmail">
        <Form.Label column sm="2">
          URL
        </Form.Label>
        <Col sm="10">
          <Form.Control name="achievementURL" value={this.state.achievementURL} onChange={this.OnInputChangeAchievement} type="text" placeholder="URL" />
        </Col>
      </Form.Group>
      <Form.Group as={Row} controlId="formPlaintextEmail">
        <Form.Label column sm="2">
          Year
        </Form.Label>
        <Col sm="10">
          <Form.Control name="achievementYear" type="text" value={this.state.achievementYear} onChange={this.OnInputChangeAchievement}  placeholder="Year" />
        </Col>
      </Form.Group>
        </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleCloseAchievement}>
              Close
            </Button>
            <Button variant="primary" onClick={this.addAchievement}>
              Add
            </Button>
          </Modal.Footer>
        </Modal>

        </div>
        <div id="ProjectModal">
        <Modal show={this.state.showProject} onHide={this.handleShowProject}>
          <Modal.Header closeButton>
            <Modal.Title>Add Project</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Form>
          <Form.Group as={Row} controlId="formPlaintextEmail">
        <Form.Label column sm="2">
          Title
        </Form.Label>
        <Col sm="10">
          <Form.Control name="projectTitle" type="text" value={this.state.projectTitle} onChange={this.OnInputChangeProject} placeholder="Title" />
        </Col>
      </Form.Group>
      <Form.Group as={Row} controlId="formPlaintextEmail">
        <Form.Label column sm="2">
          URL
        </Form.Label>
        <Col sm="10">
          <Form.Control name="projectURL" value={this.state.projectURL} onChange={this.OnInputChangeProject} type="text" placeholder="URL" />
        </Col>
      </Form.Group>
      <Form.Group as={Row} controlId="formPlaintextEmail">
        <Form.Label column sm="2">
          Year
        </Form.Label>
        <Col sm="10">
          <Form.Control name="projectYear" type="text" value={this.state.projectYear} onChange={this.OnInputChangeProject}  placeholder="Year" />
        </Col>
      </Form.Group>
        </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleCloseProject}>
              Close
            </Button>
            <Button variant="primary" onClick={this.addProject}>
              Add
            </Button>
          </Modal.Footer>
        </Modal>

        </div>



        </div>
      )

    }
    else if(this.state.members)
    {
      //write add member code
      return <AddMemberForm team_name={this.state.teamData.team_name}/>
    }

    }

    fetchPortfolio()
    {
      axios.get('http://localhost:2000/fetch_achievement').then((response)=>{
        this.setState({portfolio:response});
        this.setState({portfolio:false});


      })
      .catch((err)=>{throw err})
    }

    toggleMiddleContent(event)   // toggle middle content feed-->about-->portfolio
    {
      event.preventDefault();
      this.setState({feed:false,about:false,portfolio:false, members:false}); // resetting all tabs 
      this.setState({[event.currentTarget.dataset.tag]:true})
    
    }

    componentDidMount()
    {
       this.fetchProfile();
      
          
    }


    render()
    {
      if(this.state.loading)
        return(<p>loading</p>)
      else
        return(
            <div className="body-element">
            <div className="wrapper">
            <header>
              <div className="container">
                <div className="header-data">
                  <div className="logo">
                    <a href="index.html" title><img src="../assets/images/logo.png" alt /></a>
                  </div>{/*logo end*/}
                  <div className="search-bar">
                    <form>
                      <input type="text" name="search" placeholder="Search..." />
                      <button type="submit"><i className="la la-search" /></button>
                    </form>
                  </div>{/*search-bar end*/}
                  <nav>
                    <ul>
                      <li>
                        <a href="index.html" title>
                          <span><img src="../assets/images/icon1.png" alt /></span>
                          Home
                        </a>
                      </li>
                      <li>
                        <a href="companies.html" title>
                          <span><img src="../assets/images/icon2.png" alt /></span>
                          Companies
                        </a>
                      </li>
                      <li>
                        <a href="projects.html" title>
                          <span><img src="../assets/images/icon3.png" alt /></span>
                          Projects
                        </a>
                      </li>
                      <li>
                        <a href="profiles.html" title>
                          <span><img src="../assets/images/icon4.png" alt /></span>
                          Profiles
                        </a>
                        <ul>
                          <li><a href="user-profile.html" title>User Profile</a></li>
                          <li><a href="my-profile-feed.html" title>my-profile-feed</a></li>
                        </ul>
                      </li>
                      <li>
                        <a href="jobs.html" title>
                          <span><img src="../assets/images/icon5.png" alt /></span>
                          Jobs
                        </a>
                      </li>
                      <li>
                        <a href="#" title className="not-box-open">
                          <span><img src="../assets/images/icon6.png" alt /></span>
                          Messages
                        </a>
                        <div className="notification-box msg">
                          <div className="nt-title">
                            <h4>Setting</h4>
                            <a href="#" title>Clear all</a>
                          </div>
                          <div className="nott-list">
                            <div className="notfication-details">
                              <div className="noty-user-img">
                                <img src="../assets/images/resources/ny-img1.png" alt />
                              </div>
                              <div className="notification-info">
                                <h3><a href="messages.html" title>Jassica William</a> </h3>
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do.</p>
                                <span>2 min ago</span>
                              </div>{/*notification-info */}
                            </div>
                            <div className="notfication-details">
                              <div className="noty-user-img">
                                <img src="../assets/images/resources/ny-img2.png" alt />
                              </div>
                              <div className="notification-info">
                                <h3><a href="messages.html" title>Jassica William</a></h3>
                                <p>Lorem ipsum dolor sit amet.</p>
                                <span>2 min ago</span>
                              </div>{/*notification-info */}
                            </div>
                            <div className="notfication-details">
                              <div className="noty-user-img">
                                <img src="../assets/images/resources/ny-img3.png" alt />
                              </div>
                              <div className="notification-info">
                                <h3><a href="messages.html" title>Jassica William</a></h3>
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempo incididunt ut labore et dolore magna aliqua.</p>
                                <span>2 min ago</span>
                              </div>{/*notification-info */}
                            </div>
                            <div className="view-all-nots">
                              <a href="messages.html" title>View All Messsages</a>
                            </div>
                          </div>{/*nott-list end*/}
                        </div>{/*notification-box end*/}
                      </li>
                      <li>
                        <a href="#" title className="not-box-open">
                          <span><img src="../assets/images/icon7.png" alt /></span>
                          Notification
                        </a>
                        <div className="notification-box">
                          <div className="nt-title">
                            <h4>Setting</h4>
                            <a href="#" title>Clear all</a>
                          </div>
                          <div className="nott-list">
                            <div className="notfication-details">
                              <div className="noty-user-img">
                                <img src="../assets/images/resources/ny-img1.png" alt />
                              </div>
                              <div className="notification-info">
                                <h3><a href="#" title>Jassica William</a> Comment on your project.</h3>
                                <span>2 min ago</span>
                              </div>{/*notification-info */}
                            </div>
                            <div className="notfication-details">
                              <div className="noty-user-img">
                                <img src="../assets/images/resources/ny-img2.png" alt />
                              </div>
                              <div className="notification-info">
                                <h3><a href="#" title>Jassica William</a> Comment on your project.</h3>
                                <span>2 min ago</span>
                              </div>{/*notification-info */}
                            </div>
                            <div className="notfication-details">
                              <div className="noty-user-img">
                                <img src="../assets/images/resources/ny-img3.png" alt />
                              </div>
                              <div className="notification-info">
                                <h3><a href="#" title>Jassica William</a> Comment on your project.</h3>
                                <span>2 min ago</span>
                              </div>{/*notification-info */}
                            </div>
                            <div className="notfication-details">
                              <div className="noty-user-img">
                                <img src="../assets/images/resources/ny-img2.png" alt />
                              </div>
                              <div className="notification-info">
                                <h3><a href="#" title>Jassica William</a> Comment on your project.</h3>
                                <span>2 min ago</span>
                              </div>{/*notification-info */}
                            </div>
                            <div className="view-all-nots">
                              <a href="#" title>View All Notification</a>
                            </div>
                          </div>{/*nott-list end*/}
                        </div>{/*notification-box end*/}
                      </li>
                    </ul>
                  </nav>{/*nav end*/}
                  <div className="menu-btn">
                    <a href="#" title><i className="fa fa-bars" /></a>
                  </div>{/*menu-btn end*/}
                  <div className="user-account">
                    <div className="user-info">
                      <img src="../assets/images/resources/user.png" alt />
                      <a href="#" title>John</a>
                      <i className="la la-sort-down" />
                    </div>
                    <div className="user-account-settingss">
                      <h3>Online Status</h3>
                      <ul className="on-off-status">
                        <li>
                          <div className="fgt-sec">
                            <input type="radio" name="cc" id="c5" />
                            <label htmlFor="c5">
                              <span />
                            </label>
                            <small>Online</small>
                          </div>
                        </li>
                        <li>
                          <div className="fgt-sec">
                            <input type="radio" name="cc" id="c6" />
                            <label htmlFor="c6">
                              <span />
                            </label>
                            <small>Offline</small>
                          </div>
                        </li>
                      </ul>
                      <h3>Custom Status</h3>
                      <div className="search_form">
                        <form>
                          <input type="text" name="search" />
                          <button type="submit">Ok</button>
                        </form>
                      </div>{/*search_form end*/}
                      <h3>Setting</h3>
                      <ul className="us-links">
                        <li><a href="profile-account-setting.html" title>Account Setting</a></li>
                        <li><a href="#" title>Privacy</a></li>
                        <li><a href="#" title>Faqs</a></li>
                        <li><a href="#" title>Terms &amp; Conditions</a></li>
                      </ul>
                      <h3 className="tc"><a href="#" title>Logout</a></h3>
                    </div>{/*user-account-settingss end*/}
                  </div>
                </div>{/*header-data end*/}
              </div>
            </header>{/*header end*/}	
            <section className="cover-sec">
              <img src={this.state.teamData.profileTimeline} alt />
              <input type="file" id="uploadTimeline" name="profileTimelineUpload" style={{display:'none'}} />

              <a href="#" onClick={()=>{document.getElementById('uploadTimeline').click()}} style={{right:'89.5px', color:'#ff0000'}} ><i className="fa fa-camera"></i> Change Image</a>
            </section>
            <main>
              <div className="main-section">
                <div className="container">
                  <div className="main-section-data">
                    <div className="row">
                      <div className="col-lg-3">
                        <div className="main-left-sidebar">
                          <div className="user_profile">
                            <div className="user-pro-img">
                              <img src={this.state.profilePhoto} alt />
                              <input type="file" id="uploadPhoto" onChange={this.profilePhotoHandle} name="profilePhotoUpload" style={{display:'none'}} />
                              <a onClick={()=>{document.getElementById('uploadPhoto').click()}} title=""><i className="fa fa-camera"></i></a>
                            </div>{/*user-pro-img end*/}
                            <div className="user_pro_status">
                              {/* <ul className="flw-hr">
                              <li><a href="#" title className="hre">Connect</a></li>
                                <li><a href="#" title className="flww"><i className="la la-plus" /> Follow</a></li>
                              </ul> */}
                              <ul className="flw-status">
                                <li>
                                  <span>Connections</span>
                                  <b>34</b>
                                </li>
                                <li>
                                  <span>Followers</span>
                                  <b>155</b>
                                </li>
                              </ul>
                            </div>{/*user_pro_status end*/}
                            <ul className="social_links">
                              <li><a href="#" title><i className="la la-globe" /> www.example.com</a></li>
                              <li><a href="#" title><i className="fa fa-facebook-square" /> Http://www.facebook.com/john...</a></li>
                              <li><a href="#" title><i className="fa fa-twitter" /> Http://www.Twitter.com/john...</a></li>
                              <li><a href="#" title><i className="fa fa-google-plus-square" /> Http://www.googleplus.com/john...</a></li>
                              <li><a href="#" title><i className="fa fa-behance-square" /> Http://www.behance.com/john...</a></li>
                              <li><a href="#" title><i className="fa fa-pinterest" /> Http://www.pinterest.com/john...</a></li>
                              <li><a href="#" title><i className="fa fa-instagram" /> Http://www.instagram.com/john...</a></li>
                              <li><a href="#" title><i className="fa fa-youtube" /> Http://www.youtube.com/john...</a></li>
                            </ul>
                          </div>{/*user_profile end*/}
                          <div className="suggestions full-width">
                            <div className="sd-title">
                              <h3>Suggestions</h3>
                              <i className="la la-ellipsis-v" />
                            </div>{/*sd-title end*/}
                            <div className="suggestions-list">
                              <div className="suggestion-usd">
                                <img src="../assets/images/resources/s1.png" alt />
                                <div className="sgt-text">
                                  <h4>Jessica William</h4>
                                  <span>Graphic Designer</span>
                                </div>
                                <span><i className="la la-plus" /></span>
                              </div>
                              <div className="suggestion-usd">
                                <img src="../assets/images/resources/s2.png" alt />
                                <div className="sgt-text">
                                  <h4>Hello wolrd</h4>
                                  <span>PHP Developer</span>
                                </div>
                                <span><i className="la la-plus" /></span>
                              </div>
                              <div className="suggestion-usd">
                                <img src="../assets/images/resources/s3.png" alt />
                                <div className="sgt-text">
                                  <h4>Poonam</h4>
                                  <span>Wordpress Developer</span>
                                </div>
                                <span><i className="la la-plus" /></span>
                              </div>
                              <div className="suggestion-usd">
                                <img src="../assets/images/resources/s4.png" alt />
                                <div className="sgt-text">
                                  <h4>Bill Gates</h4>
                                  <span>C &amp; C++ Developer</span>
                                </div>
                                <span><i className="la la-plus" /></span>
                              </div>
                              <div className="suggestion-usd">
                                <img src="../assets/images/resources/s5.png" alt />
                                <div className="sgt-text">
                                  <h4>Jessica William</h4>
                                  <span>Graphic Designer</span>
                                </div>
                                <span><i className="la la-plus" /></span>
                              </div>
                              <div className="suggestion-usd">
                                <img src="../assets/images/resources/s6.png" alt />
                                <div className="sgt-text">
                                  <h4>John Doe</h4>
                                  <span>PHP Developer</span>
                                </div>
                                <span><i className="la la-plus" /></span>
                              </div>
                              <div className="view-more">
                                <a href="#" title>View More</a>
                              </div>
                            </div>{/*suggestions-list end*/}
                          </div>{/*suggestions end*/}
                        </div>{/*main-left-sidebar end*/}
                      </div>
                      <div className="col-lg-6">
                        <div className="main-ws-sec">
                          <div className="user-tab-sec">
                            <h3>{this.state.teamData.team_name}</h3>
                            <div className="star-descp">
                              <span>{this.state.teamData.cur_work}</span>
                              <ul>
                                <li><i className="fa fa-star" /></li>
                                <li><i className="fa fa-star" /></li>
                                <li><i className="fa fa-star" /></li>
                                <li><i className="fa fa-star" /></li>
                                <li><i className="fa fa-star-half-o" /></li>
                              </ul>
                            </div>{/*star-descp end*/}
                            <div className="tab-feed">
                              <ul>
                                <li  className={this.state.feed?'active':''}>
                                  <a data-tag="feed" onClick={this.toggleMiddleContent} href="#" title>
                                    <img  src="../assets/images/ic1.png" alt />
                                    <span>Feed</span>
                                  </a>
                                </li>
                                <li className={this.state.about?'active':''} data-tab="info-dd">
                                  <a  data-tag="about" onClick={this.toggleMiddleContent} href="#" title>
                                    <img  src="../assets/images/ic2.png" alt />
                                    <span>About</span>
                                  </a>
                                </li>
                                <li  className={this.state.portfolio?'active':''} data-tab="portfolio-dd">
                                  <a data-tag="portfolio" onClick={this.toggleMiddleContent} href="#" title>
                                    <img src="../assets/images/ic3.png" alt />
                                    <span>Portfolio</span>
                                  </a>
                                </li>
                                <li  className={this.state.members?'active':''}  data-tab="portfolio-dd">
                                  <a data-tag="members" onClick={this.toggleMiddleContent} href="#" title>
                                    <img src="../assets/images/ic3.png" alt />
                                    <span>Members</span>
                                  </a>
                                </li>
                                
                              </ul>
                            </div>{/* tab-feed end*/}
                          </div>{/*user-tab-sec end*/}
                          <div className="product-feed-tab current" id="feed-dd">
                            <div className="posts-section">
                              
                              {this.middleContent()}
                              
                              
                              <div className="process-comm">
                                <a href="#" title><img src="../assets/images/process-icon.png" alt /></a>
                              </div>{/*process-comm end*/}
                            </div>{/*posts-section end*/}
                          </div>{/*product-feed-tab end*/}
                          <div className="product-feed-tab" id="info-dd">
                            <div className="user-profile-ov">
                              <h3>Overview</h3>
                              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque tempor aliquam felis, nec condimentum ipsum commodo id. Vivamus sit amet augue nec urna efficitur tincidunt. Vivamus consectetur aliquam lectus commodo viverra. Nunc eu augue nec arcu efficitur faucibus. Aliquam accumsan ac magna convallis bibendum. Quisque laoreet augue eget augue fermentum scelerisque. Vivamus dignissim mollis est dictum blandit. Nam porta auctor neque sed congue. Nullam rutrum eget ex at maximus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eget vestibulum lorem.</p>
                            </div>{/*user-profile-ov end*/}
                            <div className="user-profile-ov st2">
                              <h3>Experience</h3>
                              <h4>Web designer</h4>
                              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque tempor aliquam felis, nec condimentum ipsum commodo id. Vivamus sit amet augue nec urna efficitur tincidunt. Vivamus consectetur aliquam lectus commodo viverra. </p>
                              <h4>UI / UX Designer</h4>
                              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque tempor aliquam felis, nec condimentum ipsum commodo id.</p>
                              <h4>PHP developer</h4>
                              <p className="no-margin">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque tempor aliquam felis, nec condimentum ipsum commodo id. Vivamus sit amet augue nec urna efficitur tincidunt. Vivamus consectetur aliquam lectus commodo viverra. </p>
                            </div>{/*user-profile-ov end*/}
                            <div className="user-profile-ov">
                              <h3>Education</h3>
                              <h4>Master of Computer Science</h4>
                              <span>2015 - 2017</span>
                              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque tempor aliquam felis, nec condimentum ipsum commodo id. Vivamus sit amet augue nec urna efficitur tincidunt. Vivamus consectetur aliquam lectus commodo viverra. </p>
                            </div>{/*user-profile-ov end*/}
                            <div className="user-profile-ov">
                              <h3>Location</h3>
                              <h4>India</h4>
                              <p>151/4 BT Chownk, Delhi </p>
                            </div>{/*user-profile-ov end*/}
                            <div className="user-profile-ov">
                              <h3>Skills</h3>
                              <ul>
                                <li><a href="#" title>HTML</a></li>
                                <li><a href="#" title>PHP</a></li>
                                <li><a href="#" title>CSS</a></li>
                                <li><a href="#" title>Javascript</a></li>
                                <li><a href="#" title>Wordpress</a></li>
                                <li><a href="#" title>Photoshop</a></li>
                                <li><a href="#" title>Illustrator</a></li>
                                <li><a href="#" title>Corel Draw</a></li>
                              </ul>
                            </div>{/*user-profile-ov end*/}
                          </div>{/*product-feed-tab end*/}
                          <div className="product-feed-tab" id="portfolio-dd">
                            <div className="portfolio-gallery-sec">
                              <h3>Portfolio</h3>
                              <div className="gallery_pf">
                                <div className="row">
                                  <div className="col-lg-4 col-md-4 col-sm-6 col-6">
                                    <div className="gallery_pt">
                                      <img src="../assets/images/resources/pf-img1.jpg" alt />
                                      <a href="#" title><img src="../assets/images/all-out.png" alt /></a>
                                    </div>{/*gallery_pt end*/}
                                  </div>
                                  <div className="col-lg-4 col-md-4 col-sm-6 col-6">
                                    <div className="gallery_pt">
                                      <img src="../assets/images/resources/pf-img2.jpg" alt />
                                      <a href="#" title><img src="../assets/images/all-out.png" alt /></a>
                                    </div>{/*gallery_pt end*/}
                                  </div>
                                  <div className="col-lg-4 col-md-4 col-sm-6 col-6">
                                    <div className="gallery_pt">
                                      <img src="../assets/images/resources/pf-img3.jpg" alt />
                                      <a href="#" title><img src="../assets/images/all-out.png" alt /></a>
                                    </div>{/*gallery_pt end*/}
                                  </div>
                                  <div className="col-lg-4 col-md-4 col-sm-6 col-6">
                                    <div className="gallery_pt">
                                      <img src="../assets/images/resources/pf-img4.jpg" alt />
                                      <a href="#" title><img src="../assets/images/all-out.png" alt /></a>
                                    </div>{/*gallery_pt end*/}
                                  </div>
                                  <div className="col-lg-4 col-md-4 col-sm-6 col-6">
                                    <div className="gallery_pt">
                                      <img src="../assets/images/resources/pf-img5.jpg" alt />
                                      <a href="#" title><img src="../assets/images/all-out.png" alt /></a>
                                    </div>{/*gallery_pt end*/}
                                  </div>
                                  <div className="col-lg-4 col-md-4 col-sm-6 col-6">
                                    <div className="gallery_pt">
                                      <img src="../assets/images/resources/pf-img6.jpg" alt />
                                      <a href="#" title><img src="../assets/images/all-out.png" alt /></a>
                                    </div>{/*gallery_pt end*/}
                                  </div>
                                  <div className="col-lg-4 col-md-4 col-sm-6 col-6">
                                    <div className="gallery_pt">
                                      <img src="../assets/images/resources/pf-img7.jpg" alt />
                                      <a href="#" title><img src="../assets/images/all-out.png" alt /></a>
                                    </div>{/*gallery_pt end*/}
                                  </div>
                                  <div className="col-lg-4 col-md-4 col-sm-6 col-6">
                                    <div className="gallery_pt">
                                      <img src="../assets/images/resources/pf-img8.jpg" alt />
                                      <a href="#" title><img src="../assets/images/all-out.png" alt /></a>
                                    </div>{/*gallery_pt end*/}
                                  </div>
                                  <div className="col-lg-4 col-md-4 col-sm-6 col-6">
                                    <div className="gallery_pt">
                                      <img src="../assets/images/resources/pf-img9.jpg" alt />
                                      <a href="#" title><img src="../assets/images/all-out.png" alt /></a>
                                    </div>{/*gallery_pt end*/}
                                  </div>
                                  <div className="col-lg-4 col-md-4 col-sm-6 col-6">
                                    <div className="gallery_pt">
                                      <img src="../assets/images/resources/pf-img10.jpg" alt />
                                      <a href="#" title><img src="../assets/images/all-out.png" alt /></a>
                                    </div>{/*gallery_pt end*/}
                                  </div>
                                </div>
                              </div>{/*gallery_pf end*/}
                            </div>{/*portfolio-gallery-sec end*/}
                          </div>{/*product-feed-tab end*/}
                        </div>{/*main-ws-sec end*/}
                      </div>
                      <div className="col-lg-3">
                        <div className="right-sidebar">
                          <div className="message-btn">
                            <a href="#" title><i className="fa fa-envelope" /> Message</a>
                          </div>
                          <div className="widget widget-portfolio">
                            <div className="wd-heady">
                              <h3>Portfolio</h3>
                              <img src="../assets/images/photo-icon.png" alt />
                            </div>
                            <div className="pf-gallery">
                              <ul>
                                <li><a href="#" title><img src="../assets/images/resources/pf-gallery1.png" alt /></a></li>
                                <li><a href="#" title><img src="../assets/images/resources/pf-gallery2.png" alt /></a></li>
                                <li><a href="#" title><img src="../assets/images/resources/pf-gallery3.png" alt /></a></li>
                                <li><a href="#" title><img src="../assets/images/resources/pf-gallery4.png" alt /></a></li>
                                <li><a href="#" title><img src="../assets/images/resources/pf-gallery5.png" alt /></a></li>
                                <li><a href="#" title><img src="../assets/images/resources/pf-gallery6.png" alt /></a></li>
                                <li><a href="#" title><img src="../assets/images/resources/pf-gallery7.png" alt /></a></li>
                                <li><a href="#" title><img src="../assets/images/resources/pf-gallery8.png" alt /></a></li>
                                <li><a href="#" title><img src="../assets/images/resources/pf-gallery9.png" alt /></a></li>
                                <li><a href="#" title><img src="../assets/images/resources/pf-gallery10.png" alt /></a></li>
                                <li><a href="#" title><img src="../assets/images/resources/pf-gallery11.png" alt /></a></li>
                                <li><a href="#" title><img src="../assets/images/resources/pf-gallery12.png" alt /></a></li>
                              </ul>
                            </div>{/*pf-gallery end*/}
                          </div>{/*widget-portfolio end*/}
                        </div>{/*right-sidebar end*/}
                      </div>
                    </div>
                  </div>{/* main-section-data end*/}
                </div> 
              </div>
            </main>
            <footer>
              <div className="footy-sec mn no-margin">
                <div className="container">
                  <ul>
                    <li><a href="#" title>Help Center</a></li>
                    <li><a href="#" title>Privacy Policy</a></li>
                    <li><a href="#" title>Community Guidelines</a></li>
                    <li><a href="#" title>Cookies Policy</a></li>
                    <li><a href="#" title>Career</a></li>
                    <li><a href="#" title>Forum</a></li>
                    <li><a href="#" title>Language</a></li>
                    <li><a href="#" title>Copyright Policy</a></li>
                  </ul>
                  <p><img src="../assets/images/copy-icon2.png" alt />Copyright 2017</p>
                  <img className="fl-rgt" src="../assets/images/logo2.png" alt />
                </div>
              </div>
            </footer>{/*footer end*/}
            <div className="overview-box" id="create-portfolio">
              <div className="overview-edit">
                <h3>Create Portfolio</h3>
                <form>
                  <input type="text" name="pf-name" placeholder="Portfolio Name" />
                  <div className="file-submit">
                    <input type="file" name="file" />
                  </div>
                  <div className="pf-img">
                    <img src="../assets/images/resources/np.png" alt />
                  </div>
                  <input type="text" name="website-url" placeholder="htp://www.example.com" />
                  <button type="submit" className="save">Save</button>
                  <button type="submit" className="cancel">Cancel</button>
                </form>
                <a href="#" title className="close-box"><i className="la la-close" /></a>
              </div>{/*overview-edit end*/}
            </div>{/*overview-box end*/}
          </div>

    


           </div>
           
        )
    }
}