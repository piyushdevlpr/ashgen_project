import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter as Router, Switch} from 'react-router-dom'
import './index.css';
import App from './App';
import Profileind from './Profileind';
import Profileteam from './Profileteam';
import People from './People';
import Login from './Login';
import Signup from './Signup';
import Shownotifications from './shownotifications';
import Showfriends from './showfriends';
import Dashboard from './Dashboard';
import Group from './Group';
import * as serviceWorker from './serviceWorker';
import DashboardInd from './DashboardInd';
import TeamProfile from './profiles/TeamProfile';
import TeamForm from './profiles/TeamForm';

ReactDOM.render((
    <Router>
        <Switch>
       <Route exact path = "/" component = {App}/>
       <Route exact path = "/login/" component = {Login}/>
       <Route exact path = "/signup/" component = {Signup}/>
       {/* <Route exact path = "/your-profile/" component = {Profileind}/> */}
       <Route path = "/home/" component = {Dashboard} />
       <Route path = "/home-individual/" component = {DashboardInd} />
       <Route path = "/people/" component = {People} />
       <Route path = "/notifications/" component = {Shownotifications} />
       <Route path = "/friends/" component = {Showfriends} />
       <Route path = "/groups/" component = {Group} />
       <Route path = "/team_profile/" component = {TeamProfile} />
       <Route path = "/team_form/" component = {TeamForm} />

       </Switch>
 </Router>
), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
