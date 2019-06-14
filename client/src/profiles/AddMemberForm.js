import React, { Component } from 'react';
import axios from 'axios';

export default class AddMemberForm extends Component{
    ismounted = true ;
    constructor(props){
        super(props) ;
        this.state = {
            emailid:'',
            dept:'',
            position:'',
            team_name:this.props.team_name,
        }
        this.OnInputChange = this.OnInputChange.bind(this);
        this.submitForm = this.submitForm.bind(this);
    }
    submitForm(e)
    {
        e.preventDefault();
        const config = {
            headers: {
                'content-type': 'application/json'
            },
            withCredentials: true, // default

        };

        axios.post('http://localhost:2000/send-email',this.state,config)
        .then((response)=>{
            this.setState({emailid : ""});            
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
                <label for="exampleFormControlInput1">Email ID</label>
                <input type="text" className="form-control" onChange={this.OnInputChange} value={this.state.emailid} name="emailid" id="exampleFormControlInput1" placeholder="Enter email id " />
            </div>
            <div className="form-group">
                <label for="exampleFormControlInput1">Department</label>
                <input type="text" className="form-control" onChange={this.OnInputChange} value={this.state.dept} name="dept" id="exampleFormControlInput1" placeholder="Enter email id " />
            </div>
            <div className="form-group">
                <label for="exampleFormControlInput1">Position</label>
                <input type="text" className="form-control" onChange={this.OnInputChange} value={this.state.position} name="position" id="exampleFormControlInput1" placeholder="Enter email id " />
            </div>
            <button type="submit" onClick={this.submitForm} class="btn btn-danger">Add Member</button>
                </form>
            </div>
        )
    }
}