import React, { Component } from 'react';
import axios from 'axios';

export default class TeamForm extends Component{
    ismounted = true ;
    constructor(props){
        super(props) ;
        this.state = {
            team_name:'',
            field:'',
            establishment:'',
            institute:'',
            team_size:'',
            cur_work:''

        }
        this.OnInputChange = this.OnInputChange.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.gotoprofile = this.gotoprofile.bind(this);
    }

    gotoprofile=(event)=>{
        this.props.history.push({
          pathname:'/team_profile/',
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
            "field":this.state.field,
            "establishment":this.state.establishment,
            "institute":this.state.institute,
            "team_size":this.state.team_size,
            "cur_work":this.state.cur_work

        }
        const config = {
            headers: {
                'content-type': 'application/json'
            },
            withCredentials: true, // default

        };

        axios.post('http://localhost:2000/team_profile',data,config)
        .then((response)=>{
            this.gotoprofile();
        })
        .catch((err)=>{throw err})
    }

    OnInputChange(event)
        {
            event.preventDefault();
            this.setState({
                [event.target.name] : event.target.value,
              })
              console.log(event.target.value);
        }


    render()
    {
        return(
            <div id="team_form">
                <form>
            <div className="form-group">
                <label for="exampleFormControlInput1">Team Name</label>
                <input type="text" className="form-control" onChange={this.OnInputChange} value={this.state.team_name} name="team_name" id="exampleFormControlInput1" placeholder="Enter Team Name" />
            </div>
            <div className="form-group">
                <label for="exampleFormControlInput1">Field</label>
                <input type="text" className="form-control" onChange={this.OnInputChange} name="field" value={this.state.field} id="exampleFormControlInput1" placeholder="Enter Field" />
            </div>
            <div className="form-group">
                <label for="exampleFormControlInput1">Establishment Year</label>
                <input type="text" className="form-control" onChange={this.OnInputChange} value={this.state.establishment} name="establishment" id="exampleFormControlInput1" placeholder="Enter establishment" />
            </div>
            <div className="form-group">
                <label for="exampleFormControlInput1">Institute</label>
                <input type="text" className="form-control" onChange={this.OnInputChange} value={this.state.institute} name="institute" id="exampleFormControlInput1" placeholder="Enter Institute" />
            </div>
            <div className="form-group">
                <label for="exampleFormControlInput1">Currently working</label>
                <input type="text" className="form-control" onChange={this.OnInputChange} value={this.state.cur_work} name="cur_work" id="exampleFormControlInput1" placeholder="Currently working" />
            </div>
            <div className="form-group">
                <label for="exampleFormControlInput1">Team Size</label>
                <input type="text" className="form-control" onChange={this.OnInputChange} name="team_size" value={this.state.team_size} id="exampleFormControlInput1" placeholder="Enter Team size" />
            </div>
            <button type="submit" onClick={this.submitForm} class="btn btn-primary">Submit</button>

                </form>
                
            </div>
        )
    }
}