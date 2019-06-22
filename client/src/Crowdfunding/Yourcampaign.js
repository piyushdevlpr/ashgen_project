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
         campaign_data : null,
         loading:true ,
         }
      }
    getInfo=()=>{
      axios.get('http://localhost:2000/get-user-campaign',{withCredentials: true}).then((response)=>{

         this.setState({campaign_data : response.data},()=>{
            this.setState({loading:false});
            console.log(this.state) ;
           })
        })
         .catch((err)=>{throw err})
   
    }
    componentDidMount(){
       this.getInfo() ;
    }
    render()
    {
       if(this.state.loading === true){
         return(
            <div>Loading...</div>
         )
       }else
        return(
            <div className="container">
                    <div style={{'textAlign':"center",paddingBottom : '80px',paddingTop:'50px' }}>
                        <h4>{this.state.campaign_data.campaign_name}</h4>
                        <h3>{this.state.campaign_data.author.username} at {this.state.campaign_data.postedAt}</h3>
                    </div>
                <div className="row">
                    
                    <div className="col-lg-4">
                        <img src={this.state.campaign_data.image_link} />
                        <p>{this.state.campaign_data.short_desc}</p>
                    </div>
                    <div className="col-lg-8">
                        <p>
                            {this.state.campaign_data.long_desc}
                        </p>
                    </div>
                </div>
            </div>
        )
    }
}