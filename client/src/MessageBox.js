import React, { Component } from 'react';
import './App.css';

class App extends Component {
   _ismounted = true ;
  constructor(props){
    super(props);
    this.state = {
      tochatwith:this.props.tochatwith,
      previosmess:[]
    }
}
componentDidMount(){
    var socket = socketIOClient('http://127.0.0.1:2000', {transports: ['websocket']});
    socket.emit("showmessages",{username:this.props.username, friendname:this.state.tochatwith}) ;
    socket.on("getmessages",data=>{this.setState({previousmess:[]}); this.setState({previousmess:data.messages})})
}
componentWillUnmount(){
  this._ismounted = false ;
}
render() {
    if(this.state.tochatwith === ''){
                return null;
            }else{
                // {this.getmessagesforfirsttime()}
                return(
                    <div>
                        <h1>Send message to {this.state.tochatwith}</h1>
                        <div>
                        <div style={styles}>
                            {this.showpreviousmessages()}
                        </div>
                        <form>
                            <input ref={(ref) => this.mainInput= ref} required={true} placeholder='enter text' type='text' name='message' onChange={this.handlechange} value={this.state.currentmsg}></input>
                            <button onClick={this.sendmsg}>Send</button>
                        </form>
                        {/* {this.allsocketsoff()} */}
                        </div>
                    </div>
                );
  }
}
}
export default App;
