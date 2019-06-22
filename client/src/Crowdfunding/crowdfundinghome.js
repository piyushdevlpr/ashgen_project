import React, { Component } from 'react';
import axios from 'axios';
// import '../assets/css/animate.css'
// import '../assets/css/bootstrap.min.css'
// import '../assets/css/flatpickr.min.css'
// import '../assets/css/font-awesome.min.css'
// import '../assets/css/jquery.range.css'
// import '../assets/css/line-awesome.css'
// import '../assets/css/line-awesome-font-awesome.min.css'
// import "../assets/css2/bootstrap.min.css"
import '../assets/css2/responsive.css'
import '../assets/css2/style.css'
// import '../assets/css/style1.css'

export default class CrowdFundingHome extends Component{
    constructor(props){
        super(props) ;
        this.state = {
         campaign : false,
         loading:true ,
         team:'',
         id:'',
        }
        this.gotocamp = this.gotocamp.bind(this) ;
        this.gotoyourcamp = this.gotoyourcamp.bind(this) ;
    
      }
    getInfo=()=>{
      axios.get('http://localhost:2000/get-user',{withCredentials: true}).then((response)=>{

         this.setState({team:response.data.team,id:response.data._id},()=>{
           if(this.state.team === true){
            axios.get('http://localhost:2000/fetch_team_profile',{withCredentials: true}).then((response)=>{
               this.setState({campaign : response.data[0].funding_status},()=>{
                  this.setState({loading:false});
                  console.log(this.state);                  
               })
         }).catch((err)=>{throw err})
   
           }else{
            this.setState({loading:false});
           }

               });
         })
         .catch((err)=>{throw err})
   
    }
    componentDidMount(){
       this.getInfo() ;
    }
    gotocamp=(e)=>{
      this.props.history.push({
         pathname:'/start-campaign/',
         state :{
             username : this.props.location.state.username,
             team:this.state.team, 
         }
       }) ;
    }
    gotoyourcamp=(e)=>{
      this.props.history.push({
         pathname:'/your-campaign/',
         state :{
             username : this.props.location.state.username,
             team:this.state.team, 
         }
       }) ;
    }
    render()
    {
       if(this.state.loading === true){
         return(
            <div>Loading...</div>
         )
       }else
        return(
            // <div></div>
      <span>
      <div id="header" class="header">
            
            <div class="header-image">
                <div class="header-content">
                    <div class="container">
                        {/* <div class="row"> */}
                            <div class="header-content-inner">
                                {/* <a href="index-2.html" class="logo"><img src="../assets/images2/logo1.png" alt /></a> */}
                                {/* <a href="index-2.html" class="logo"><img src="https://envato-shoebox-0.imgix.net/4646/3935-85f4-41a0-b940-708875ee0a15/tajak+019.jpg?w=500&h=278&fit=crop&crop=edges&auto=compress%2Cformat&s=c45335aca948555287bc4229b1632950" alt /></a> */}
                               
                                <h1>OJAS CrowdFunding</h1>
								
								{/* <a data-scroll data-options='{ "easing": "easeInQuad" }'   href="#demo-section" class="custom-btn"></a> */}
                                <div class="purchase"><a href="https://themeforest.net/item/greenforest-environmental-ecology-responsive-template/19671308?s_rank=1" target="_blank">Support A Campaign</a></div>
                              {this.state.team ? 
                              (this.state.campaign ?
                              <div class="purchase"><a onClick={this.gotoyourcamp} target="_blank">Track your Campaign</a></div>
                              :
                              <div class="purchase"><a onClick={this.gotocamp} target="_blank">Start A Campaign</a></div>
                              )
                              :
                              null 
                              }
                            </div>
                        </div>
                    </div>
                {/* </div> */}
            </div>
      </div>
   <div className="container-fluid">
      <div className="row">
      <div class="col-lg-4 card" >
  <img class="card-img-top" src="https://envato-shoebox-0.imgix.net/4646/3935-85f4-41a0-b940-708875ee0a15/tajak+019.jpg?w=500&h=278&fit=crop&crop=edges&auto=compress%2Cformat&s=c45335aca948555287bc4229b1632950" alt="Card image cap" />
  <div class="card-body">
    <h5 class="card-title">Card title</h5>
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
    <div class="progress">
  <div class="progress-bar bg-warning" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" style={{width:'50%'}}>50%</div>
</div>
<p>80$ raised</p>
  </div>
  <div className="card-footer row" style={{}}>
     <div style={{width:'50%', 'border-right' : '1px solid black','padding-left' : '10%'}}>
         <h3>days left</h3><br/>
         <h3>15</h3>
     </div>
     <div style={{width:'50%','padding-left' : '10%'}}>
     <h3>left</h3><br/>
         <h3>80$</h3>
     </div>
  </div>
   </div>
   </div>
   </div>
       <a  data-scroll data-options='{ "easing": "easeInQuad" }'   href="body.html" class="scroll-top"><i class="fa fa-angle-double-up" aria-hidden="true"></i></a>
</span>

        )
    }
}