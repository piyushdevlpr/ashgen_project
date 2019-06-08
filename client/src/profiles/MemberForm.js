import React, { Component } from 'react';
import axios from 'axios';

export default class TeamForm extends Component{
    ismounted = true ;
    constructor(props){
        super(props) ;
        this.state = {
            emailid:'',
            username:this.props.username
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
                <label for="exampleFormControlInput1">Team Name</label>
                <input type="text" className="form-control" onChange={this.OnInputChange} value={this.state.team_name} name="emailid" id="exampleFormControlInput1" placeholder="Enter email id " />
            </div>
            <button type="submit" onClick={this.submitForm} class="btn btn-primary">Submit</button>
                </form>
            </div>
        )
    }
}