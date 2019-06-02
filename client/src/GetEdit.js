import React, { Component } from 'react';
import socketIOClient from "socket.io-client";
const axios = require("axios");


export default class Profile extends Component{
    constructor(props){
        super(props) ;
        this.state = {
            username : this.props.data.username ,
            team : this.props.data.team,
            first_name: this.props.data.first_name,
            Last_Name:this.props.data.Last_Name,
            Specialisation:this.props.data.Specialisation,
            College:this.props.data.College,
            Teams:this.props.data.Teams,
            Short_Bio:this.props.data.Short_Bio,
            Message_Request_Option:this.props.data.Message_Request_Option,
            Projects_and_competitions:this.props.data.Projects_and_competitions,
            Achievements_in_competitions:this.props.data.Achievements_in_competitions,
            open_to_which_type_of_company_projects:this.props.data.open_to_which_type_of_company_projects,
            Open_to_which_type_of_collabs:this.props.data.Open_to_which_type_of_collabs,
            departmentarr : this.props.data.departmentarr,
            members:this.props.data.members,
            edit : this.props.data.edit
        }
        this.handleChange = this.handleChange.bind(this);
        this.updateindividual = this.updateindividual.bind(this);
        this.updateteam = this.updateteam.bind(this) ;
    }
    handleChange(e){
        this.setState({[e.target.name]: e.target.value})
    }
    updateindividual(e){
        e.preventDefault() ;
        fetch("http://localhost:2000/your-profile", {
            // fetch(" https://ojus-server-132kgu2rdjqbfc.herokuapp.com/your-profile", {
            method: "POST",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(this.state),
            credentials : 'include'
        })
        
    }
    updateteam(e){
        fetch("http://localhost:2000/team-profile", {
            // fetch(" https://ojus-server-132kgu2rdjqbfc.herokuapp.com/team-profile", {
            method: "POST",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(this.state),
            credentials:'include'
            })
    }
    componentDidMount(){
        console.log(this.state) ;
    }
    render()
    {
        return(
            this.state.team 
            ?
            (
            <div>
                <form>
                    <label>Specialisation : </label> <input name='Specialisation' value={this.state.Specialisation} onChange={this.handleChange} placeholder='Specialisation'/><br/>
                    <label>College : </label> <input name='College' value={this.state.College} onChange={this.handleChange} placeholder='College'/><br/>
                    <label>Teams : </label> <input name='Teams' value={this.state.Teams} onChange={this.handleChange} placeholder='Teams'/><br/>
                    <label>Short_Bio : </label> <input name='Short_Bio' value={this.state.Short_Bio} onChange={this.handleChange} placeholder='Short Bio'/><br/>
                    <label>Message Request Option : </label> <input name='Message_Request_Option' value={this.state.Message_Request_Option} onChange={this.handleChange} placeholder='Message Request Option'/><br/>
                    <label>Projects And Competitions : </label> <input name='Projects_and_competitions' value={this.state.Projects_and_competitions} onChange={this.handleChange} placeholder='Projects and competitions'/><br/>
                    <label>Achievements In Competitions : </label> <input name='Achievements_in_competitions' value={this.state.Achievements_in_competitions} onChange={this.handleChange} placeholder='Achievements in competitions'/><br/>
                    <label>Open To Which Type  Of Company Projects : </label> <input name='open_to_which_type_of_company_projects' value={this.state.open_to_which_type_of_company_projects} onChange={this.handleChange} placeholder='Open to which type of company projects'/><br/>
                    <label>Open To Which Type Of Collabs</label> <input name='Open_to_which_type_of_collabs' value={this.state.Open_to_which_type_of_collabs} onChange={this.handleChange} placeholder='Open to which type of collabs'/><br/>        
                    <button onClick={this.update}>UPDATE</button>
                </form>
            </div> 
            )
            :
            (
            <div>
                <form>
                   <label>First Name : </label> <input name='first_name' value={this.state.first_name} onChange={this.handleChange} placeholder='first name'/><br/>
                   <label>Last Name : </label> <input name='last_name' value={this.state.last_name} onChange={this.handleChange} placeholder='Last Name'/><br/>
                   <label>Specialisation : </label> <input name='Specialisation' value={this.state.Specialisation} onChange={this.handleChange} placeholder='Specialisation'/><br/>
                    <label>College : </label> <input name='College' value={this.state.College} onChange={this.handleChange} placeholder='College'/><br/>
                    <label>Teams : </label> <input name='Teams' value={this.state.Teams} onChange={this.handleChange} placeholder='Teams'/><br/>
                    <label>Short_Bio : </label> <input name='Short_Bio' value={this.state.Short_Bio} onChange={this.handleChange} placeholder='Short Bio'/><br/>
                    <label>Message Request Option : </label> <input name='Message_Request_Option' value={this.state.Message_Request_Option} onChange={this.handleChange} placeholder='Message Request Option'/><br/>
                    <label>Projects And Competitions : </label> <input name='Projects_and_competitions' value={this.state.Projects_and_competitions} onChange={this.handleChange} placeholder='Projects and competitions'/><br/>
                    <label>Achievements In Competitions : </label> <input name='Achievements_in_competitions' value={this.state.Achievements_in_competitions} onChange={this.handleChange} placeholder='Achievements in competitions'/><br/>
                    <label>Open To Which Type  Of Company Projects : </label> <input name='open_to_which_type_of_company_projects' value={this.state.open_to_which_type_of_company_projects} onChange={this.handleChange} placeholder='Open to which type of company projects'/><br/>
                    <label>Open To Which Type Of Collabs</label> <input name='Open_to_which_type_of_collabs' value={this.state.Open_to_which_type_of_collabs} onChange={this.handleChange} placeholder='Open to which type of collabs'/><br/>        
                    <button onClick={this.updateindividual}>UPDATE</button>
                </form>
            </div>
            )        
        );
    }
}