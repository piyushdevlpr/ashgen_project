import React, { Component } from 'react';
import axios from 'axios';

export default class TeamForm extends Component{
    ismounted = true ;
    constructor(props){
        super(props) ;
        this.state = {
            team_name:'',
            name:'',
            institute:'',

        }
        this.OnInputChange = this.OnInputChange.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.gotoprofile = this.gotoprofile.bind(this);
    }

    gotoprofile=(event)=>{
        this.props.history.push({
          pathname:'/member-profile/',
          state :{
              username : this.props.location.state.username 
          }
        }) ;
    }

    submitForm(e)
    {
        e.preventDefault();
        var data = {
            "team_name":this.state.team_name,
            "name":this.state.name,
            "institute":this.state.institute,

        }
        data.info = this.props.location.state.info;
        const config = {
            headers: {
                'content-type': 'application/json'
            },
            withCredentials: true, // default

        };

        axios.post('http://localhost:2000/member_profile',data,config)
        .then((response)=>{
            this.gotoprofile();
            console.log(response);
        })
        .catch((err)=>{throw err})
    }

    OnInputChange(event)
        {
            event.preventDefault();
            this.setState({
                [event.target.name] : event.target.value,
              })
        }

        componentWillMount()
        {
            this.setState({team_name:this.props.location.state.info.team_name});
            console.log(this.props.location.state.info)
        }


    render()
    {
        return(
            <div id="team_form">
                <form>
            <div className="form-group">
                <label for="exampleFormControlInput1">Name</label>
                <input type="text" className="form-control" onChange={this.OnInputChange} value={this.state.name} name="name" id="exampleFormControlInput1" placeholder="Enter Name" />
            </div>
            <div className="form-group">
                <label for="exampleFormControlInput1">Institute</label>
                <input type="text" className="form-control" onChange={this.OnInputChange} name="institute" value={this.state.institute} id="exampleFormControlInput1" placeholder="Enter Institute" />
            </div>
            <div className="form-group">
                <label for="exampleFormControlInput1">Team Name</label>
                <input type="text" className="form-control"  disabled value={this.state.team_name} name="team_name" id="exampleFormControlInput1" />
            </div>
           
            <button type="submit" onClick={this.submitForm} class="btn btn-primary">Submit</button>

                </form>
                
            </div>
        )
    }
}