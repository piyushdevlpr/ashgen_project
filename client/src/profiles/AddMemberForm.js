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
            pending:[],
            pendingLoading:true,
        }
        this.OnInputChange = this.OnInputChange.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.fetchPending = this.fetchPending.bind(this);
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
            this.setState({emailid:'',position:'',dept:''});            
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

    fetchPending()
    {
        if(this.state.pendingLoading)
        {
             axios.get('http://localhost:2000/pending_members',{withCredentials: true}).then((response)=>{
                this.setState({pending:response.data});
                this.setState({pendingLoading:false})
            })
            .catch((err)=>{throw err})

        }
        else{
            var list = this.state.pending.map(function(item)
            {
                return(
                    <div id="pending" style={{marginTop:10}}>
                    <ul className="list-group">
                    <li className="list-group-item">Email: {item.email}</li>
                    
                </ul>
          
                  </div>
                )
            })

            return list;
        }
      


    }

    render()
    {
        return(
            <div>
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
            <div style={{marginTop:20}}>
           <h1> {this.state.pending.length>0?'Pending':''}</h1>
            {this.fetchPending()}
            </div>

            </div>
        )
    }
}