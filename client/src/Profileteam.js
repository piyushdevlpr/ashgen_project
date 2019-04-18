import React, { Component } from 'react';
import './App.css';

class Profileteam extends Component {
    constructor(props){
        super(props);
        this.state= {
            first_name: '',
            Last_Name:'',
            Specialisation:'',
            College:'',
            Teams:'',
            Short_Bio:'',
            Message_Request_Option:'',
            Projects_and_competitions:'',
            Achievements_in_competitions:'',
            open_to_which_type_of_company_projects:'',
            Open_to_which_type_of_collabs:''
        }
        this.gotohome = this.gotohome.bind(this) ;
        this.handleChange = this.handleChange.bind(this) ;
    }
    handleChange=(event)=>{
        event.preventDefault();
        this.setState({
            [event.target.name] : event.target.value
        })
    }
    gotohome=(event)=>{
        event.preventDefault() ;
        fetch("http://localhost:2000/team-profile", {
            method: "POST",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(this.state),
            credentials:'include'
            })
            //.then(res => res.json()).then(data => {if(this._ismounted === true){this.setState({loggedin : data})}})
      
        this.props.history.push({
            pathname: '/home/',
            state: {
              loggedin: "true",
              signedup: false,
              username: this.props.location.state.username,
              emailid: this.props.location.state.emailid
            }
          });
    }
    render(){
        if(this.props.location.state === undefined){
            this.props.history.push("/") ;
            return null ;
        }else{
        return(
            <div>
               <form onSubmit={this.gotohome}>
                    <input name='first_name' value={this.state.first_name} onChange={this.handleChange} placeholder='first name'/><br/>
                    <input name='last_name' value={this.state.last_name} onChange={this.handleChange} placeholder='Last Name'/><br/>
                    <input name='Specialisation' value={this.state.Specialisation} onChange={this.handleChange} placeholder='Specialisation'/><br/>
                    <input name='College' value={this.state.College} onChange={this.handleChange} placeholder='College'/><br/>
                    <input name='Teams' value={this.state.Teams} onChange={this.handleChange} placeholder='Teams'/><br/>
                    <input name='Short_Bio' value={this.state.Short_Bio} onChange={this.handleChange} placeholder='Short Bio'/><br/>
                    <input name='Message_Request_Option' value={this.state.Message_Request_Option} onChange={this.handleChange} placeholder='Message Request Option'/><br/>
                    <input name='Projects_and_competitions' value={this.state.Projects_and_competitions} onChange={this.handleChange} placeholder='Projects and competitions'/><br/>
                    <input name='Achievements_in_competitions' value={this.state.Achievements_in_competitions} onChange={this.handleChange} placeholder='Achievements in competitions'/><br/>
                    <input name='open_to_which_type_of_company_projects' value={this.state.open_to_which_type_of_company_projects} onChange={this.handleChange} placeholder='Open to which type of company projects'/><br/>
                    <input name='Open_to_which_type_of_collabs' value={this.state.Open_to_which_type_of_collabs} onChange={this.handleChange} placeholder='Open to which type of collabs'/><br/>
                    <button>HOME</button>
                </form>
            </div>

        );
                }
    }
}
export default Profileteam ;