import React, { Component } from 'react';
import socketIOClient from "socket.io-client";
import GetEdit from './GetEdit' ;
const axios = require("axios");


export default class Profile extends Component{
    constructor(props){
        super(props) ;
        this.state = {
            username : this.props.location.state.username ,
            team : 'set',
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
            Open_to_which_type_of_collabs:'',
            departmentarr : [],
            members:[],
            edit : false
        }
    }
    getProfile=()=>{
        fetch("http://localhost:2000/getprofile/"+this.state.username,{
        // fetch("https://ojus-server-132kgu2rdjqbfc.herokuapp.com/getprofile",{
            method: "GET",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            credentials:'include'
          }).then(res => res.json()).then(data => {
              console.log(data);
                this.setState({
                    team:data.team,
                    first_name: data.user.first_name,
                    Last_Name:data.user.Last_Name,
                    Specialisation:data.user.Specialisation,
                    College:data.user.College,
                    Teams:data.user.Teams,
                    Short_Bio:data.user.Short_Bio,
                    Message_Request_Option:data.user.Message_Request_Option,
                    Projects_and_competitions:data.user.Projects_and_competitions,
                    Achievements_in_competitions:data.user.Achievements_in_competitions,
                    open_to_which_type_of_company_projects:data.user.open_to_which_type_of_company_projects,
                    Open_to_which_type_of_collabs:data.user.Open_to_which_type_of_collabs,
                    departmentarr : data.user.Departments,
                    members:data.user.members
                },function(){
              console.log(this.state)
          })})
    }
    componentDidMount(){
        this.getProfile() ;
    }
    getedit=()=>{
        this.setState({edit:true}) ;
    }
    render()
    {
        return(
            this.state.team === 'set' 
            ?
            (
                null 
            )
            :(!this.state.edit ? 
            (this.state.team === true) ?
            (
                <div>
                    <div>Username : <span>{this.state.username}</span></div>

                    <div>Departments : {this.state.departmentarr.length !== 0 ? <span>{this.state.departmentarr[0].department}</span> : <span>None</span>}</div>
                    
                    <div>Members : {this.state.members.length !== 0 ?<span>{this.state.members[0].name}</span> :<span>None</span>}</div>

                    <div>Specialistaion : {this.state.Specialisation ?this.state.Specialisation : <span>None</span>}</div>
                    
                    <div>Teams : {this.state.Teams ?this.state.Teams :<span>None</span>}</div>
                    
                    <div>College : {this.state.College ?this.state.College  :<span>None</span>}</div>
                    
                    <div>Bio : {this.state.Short_Bio ?this.state.Short_Bio : <span>None</span>}</div>
                    
                    <div>Message Request Option : {this.state.Message_Request_Option ?this.state.Message_Request_Option :<span>None</span>}</div>
                    
                    <div>Projects And Competition{this.state.Projects_and_competitions ?this.state.Projects_and_competitions :<span>None</span>}</div>
                    
                    <div>Achievements In Competitions : {this.state.Achievements_in_competitions ?this.state.Achievements_in_competitions :<span>None</span>}</div>
                    
                    <div>Open To Which Type Of Company Projects : {this.state.open_to_which_type_of_company_projects ?this.state.open_to_which_type_of_company_projects :<span>None</span>}</div>
                    
                    <div>Open To Which Type Of Collabs : {this.state.Open_to_which_type_of_collabs ?this.state.Open_to_which_type_of_collabs :<span>None</span> }</div>

                    <button onClick={()=>this.getedit()}>Edit</button>
                </div>
            )
            :(this.state.team === false)?
            (
                <div>
                    <div>Username : <span>{this.state.username}</span></div>
                    
                    <div>First Name : {this.state.first_name ? this.state.first_name : <span>None</span>}</div>
                    
                    <div>Last Name : {this.state.Last_Name ? this.state.Last_Name: <span>None</span>}</div>
                    
                    <div>Specialistaion : {this.state.Specialisation ?this.state.Specialisation : <span>None</span>}</div>
                    
                    <div>Teams : {this.state.Teams ?this.state.Teams :<span>None</span>}</div>
                    
                    <div>College : {this.state.College ?this.state.College  :<span>None</span>}</div>
                    
                    <div>Bio : {this.state.Short_Bio ?this.state.Short_Bio : <span>None</span>}</div>
                    
                    <div>Message Request Option : {this.state.Message_Request_Option ?this.state.Message_Request_Option :<span>None</span>}</div>
                    
                    <div>Projects And Competition{this.state.Projects_and_competitions ?this.state.Projects_and_competitions :<span>None</span>}</div>
                    
                    <div>Achievements In Competitions : {this.state.Achievements_in_competitions ?this.state.Achievements_in_competitions :<span>None</span>}</div>
                    
                    <div>Open To Which Type Of Company Projects : {this.state.open_to_which_type_of_company_projects ?this.state.open_to_which_type_of_company_projects :<span>None</span>}</div>
                    
                    <div>Open To Which Type Of Collabs : {this.state.Open_to_which_type_of_collabs ?this.state.Open_to_which_type_of_collabs :<span>None</span> }</div>
                    
                    <button onClick={()=>this.getedit()}>Edit</button>

                </div>
            ):null
            :
            <div>
                <GetEdit data={this.state}/>
            </div>
            )
        );
    }
}