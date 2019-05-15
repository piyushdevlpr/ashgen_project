import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter as Router, Switch} from 'react-router-dom'
import './index.css';
import App from './App';
import Profileind from './Profileind';
import Profileteam from './Profileteam';
import People from './People';
import Shownotifications from './shownotifications';
import Showfriends from './showfriends';
import Dashboard from './Dashboard';
import Group from './Group';
import * as serviceWorker from './serviceWorker';

ReactDOM.render((
    <Router>
        <Switch>
       <Route exact path = "/" component = {App}/>
       <Route exact path = "/team-profile/" component = {Profileteam}/>
       <Route exact path = "/your-profile/" component = {Profileind}/>
       <Route path = "/home/" component = {Dashboard} />
       <Route path = "/people/" component = {People} />
       <Route path = "/notifications/" component = {Shownotifications} />
       <Route path = "/friends/" component = {Showfriends} />
       <Route path = "/groups/" component = {Group} />
       </Switch>
 </Router>
), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
