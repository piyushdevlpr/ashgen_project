import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter as Router, Switch} from 'react-router-dom'
import './index.css';
import App from './App';
import Dashboard from './Dashboard';
import * as serviceWorker from './serviceWorker';

ReactDOM.render((
    <Router>
        <Switch>
       <Route exact path = "/" component = {App}/>
       <Route path = "/home/" component = {Dashboard} />
       </Switch>
 </Router>
), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
