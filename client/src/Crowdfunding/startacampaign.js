import React, { Component } from 'react';
import axios from 'axios';

export default class CrowdFundingHome extends Component{
    constructor(props){
        super(props) ;
        this.state = {
            teamname : 'hello',
            campaignname : '',
            shortdesc : '',
            longdesc : '',
            amount : 0,
            months : '',
            campaignimage:null,
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleImageChange = this.handleImageChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange=(event)=>{
        event.preventDefault() ;
        this.setState({
          [event.target.name] : event.target.value,
        },function(){
            console.log(this.state) ;   
        })

    }
    handleImageChange=(event)=>{
        event.preventDefault() ;
        this.setState({
          [event.target.name] : event.target.files[0],
        },function(){
            console.log(this.state) ;   
        })

    }
    handleSubmit(event){
        event.preventDefault() ;
        var data = {};
            data = this.state ;
            const config = {
                headers: {
                  'content-type': 'multipart/form-data'
  
                },      
                withCredentials: true, // default
            };
            var data = new FormData() ;
            data.append('campaignimage',this.state.campaignimage);
            data.append('campaignname',this.state.campaignname);
            data.append('longdesc',this.state.longdesc);
            data.append('shortdesc',this.state.shortdesc);
            data.append('months',this.state.months);
            data.append('amount',this.state.amount);
        //    axios.post("https://ojus-server-132kgu2rdjqbfc.herokuapp.com/text_upload",data,config)
        
           axios.post("http://localhost:2000/fundingcampaign_upload",data,config)
           .then((response) => {
                console.log("succes") ;
           }).catch((error) => {

       });


    }
    render()
    {
        // if(!this.props.location.state){
        //     return(
        //     <div>Login first ....</div>
        //     );
        // }else
            return(
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>Team Name : </label><input className="form-control" value={this.state.teamname} disabled />
                    <label>Campaign Name : </label><input className="form-control" name="campaignname" onChange={this.handleChange} value={this.state.campaignname} />
                    <label>Campaign Image : </label><input type="file" name="campaignimage"  onChange={this.handleImageChange} /><br/>
                    <label>Short Desccription : </label><input className="form-control" name="shortdesc" onChange={this.handleChange} value={this.state.shortdesc} maxLength='20' minLength='10' />
                    <label>Long Desccription : </label><textarea className="form-control" name="longdesc" onChange={this.handleChange} value={this.state.longdesc} />
                    <label>Amount to be raised : </label><input type="number" className="form-control" name="amount" onChange={this.handleChange} value={this.state.amount} />
                    <label>Days expected : </label>
                    <select className="form-control browser-default custom-select" name="months" value={this.state.months} onChange={this.handleChange}>
                                        <option selected>1 month</option>
                                        <option>2 months</option>
                                        <option>3 months</option>
                    </select>
                    <button>Submit</button>
                </form>
            </div>

        )
    }
}