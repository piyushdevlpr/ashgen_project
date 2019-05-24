import React, { Component } from 'react';
import './App.css';

class Profileteam extends Component {
    constructor(props){
        super(props);
        this.state= {
            username:this.props.location.state.username,
            i:0,
            next : false,
            departmentarr : [],
            dep:[],
            membername:'',
            members:[],
            users:[],
            first_name: '',
            Last_Name:'',
            Specialisation:'',
            College:'',
            Teams:'',
            department : '',
            Short_Bio:'',
            Message_Request_Option:'',
            Projects_and_competitions:'',
            Achievements_in_competitions:'',
            open_to_which_type_of_company_projects:'',
            Open_to_which_type_of_collabs:''
        }
        this.gotohome = this.gotohome.bind(this) ;
        this.handleChange = this.handleChange.bind(this) ;
        this.handleChange2 = this.handleChange2.bind(this) ;
        this.addinputfield = this.addinputfield.bind(this) ;
        this.addmemberfield = this.addmemberfield.bind(this) ;
    }
    authname=(data)=>{
        if(!data.team){
            for(var i= 0 ; i < this.state.members.length ; i++){
                if(this.state.members[i] === data.user){
                    return null ;
                }
            }
            return <li>{data.user}<button onClick={()=>this.addmemberfield(data.user)}>add</button></li>
        }
    }
    getusers=()=>{
        if(this.state.users.length !== 0){
            const li = this.state.users.map((ind,data)=>
                this.authname(ind)
            );
            return li ;
        }
        return null ;
    }
    handleChange=(event)=>{
        event.preventDefault();
        this.setState({
            [event.target.name] : event.target.value
        })
    }
    handleChange2=(event)=>{
        event.preventDefault();
        this.setState({
            [event.target.name] : event.target.value
        },function(){
            this.fetchdetails() ;
        })
    }
    fetchdetails=()=>{
        if(this.state.membername === undefined){
            this.setState({
                membername:''
            });
        }
        fetch("http://localhost:2000/people/"+this.state.membername)    
        .then(response => response.json())
        .then(datas =>{
          this.setState({
               users : datas
            })
                console.log(this.state) ;
            }
        )
        .catch(error => console.log(error));
    }
    gotonext=()=>{
        this.setState({next:!this.state.next}) ;   
    }
    gotohome(){
        //  event.preventDefault() ;
        fetch("http://localhost:2000/team-profile", {
            method: "POST",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(this.state),
            credentials:'include'
            }).then(res=>res.json()).then(data=>{if(data.data === "send"){
                this.props.history.push({
                    pathname: '/home/',
                    state: {
                      loggedin: "true",
                      signedup: false,
                      username: this.props.location.state.username,
                      emailid: this.props.location.state.emailid
                    }
                  });
            }})
    }
    addinputfield(event){
        event.preventDefault();
        if(this.state.department !== ''){
        var x = this.state.departmentarr ;
        x.push(this.state.department) ;
        this.setState({
            departmentarr : x,
            department : ''
        })
    }
    }
    addmemberfield=(event)=>{
        //  event.preventDefault();
        if(this.state.membername !== ''){
        var x = this.state.members ;
        x.push(event) ;
        this.setState({
            members : x,
            membername : '',
            users:[]
        })
    }
    }
    // increment=(i)=>{
    // }
     addashead=(dep,head)=>{
        var ob = {} ;
        ob= {department : dep , head : head} ;
        var x = this.state.dep ;
        x.push(ob)
        this.setState({dep : x},function(){
            this.setState({i : this.state.i + 1},function(){
                if(this.state.i === this.state.departmentarr.length){
                    this.gotohome() ;
                }
            }) ;        
        })
    }
    getmembers=(dep)=>{
       const li = this.state.members.map((data,ind)=>
            <li>{data}<button onClick={()=>this.addashead(dep,data)}>head</button></li>
        );
        return li ;
    }
    getdepheads=()=>{
        var i = this.state.i ;
        if(this.state.i <= this.state.departmentarr.length-1 ){
            return <div>{this.state.departmentarr[i]} <span>{this.getmembers(this.state.departmentarr[i])}</span></div>            
        }else if(i === this.state.departmentarr.length-1){
            return <div>{this.state.departmentarr[i]} <span>{this.getmembers(this.state.departmentarr[i])}</span></div>            
        }else{
            return null ; //loading
        }
    }
    render(){
        if(this.props.location.state === undefined){
            this.props.history.push("/") ;
            return null ;
        }else{
        return(
            <div>
                <h1>TEAM PROFILE</h1>
               {!this.state.next ?
               (<form>
                    <input name='Specialisation' value={this.state.Specialisation} onChange={this.handleChange} placeholder='Specialisation'/><br/>
                    <input name='College' value={this.state.College} onChange={this.handleChange} placeholder='College'/><br/>
                    <input name='department' value={this.state.department} onChange={this.handleChange} placeholder='department'/><button onClick = {this.addinputfield}>+</button><br/>
                    <input name='membername' value={this.state.membername} onChange={this.handleChange2} placeholder='membername'/><br/>
                    {this.getusers()}
                    <input name='Short_Bio' value={this.state.Short_Bio} onChange={this.handleChange} placeholder='Short Bio'/><br/>
                    <input name='Message_Request_Option' value={this.state.Message_Request_Option} onChange={this.handleChange} placeholder='Message Request Option'/><br/>
                    <input name='Projects_and_competitions' value={this.state.Projects_and_competitions} onChange={this.handleChange} placeholder='Projects and competitions'/><br/>
                    <input name='Achievements_in_competitions' value={this.state.Achievements_in_competitions} onChange={this.handleChange} placeholder='Achievements in competitions'/><br/>
                    <input name='open_to_which_type_of_company_projects' value={this.state.open_to_which_type_of_company_projects} onChange={this.handleChange} placeholder='Open to which type of company projects'/><br/>
                    <input name='Open_to_which_type_of_collabs' value={this.state.Open_to_which_type_of_collabs} onChange={this.handleChange} placeholder='Open to which type of collabs'/><br/>
                    <button onClick={this.gotonext}>NEXT</button>
               </form> )
                : ((this.state.members.length >= this.state.departmentarr.length) && (this.state.members.length !== 0) )?(
                    (this.getdepheads())
                    // <button onClick={this.gotohome}>HOME</button>
                ):(this.gotonext())
                }
                {console.log(this.state)}
            </div>
        );
                }
    }
}
export default Profileteam ;