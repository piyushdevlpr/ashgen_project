import React, { Component } from 'react';

 class GetGroup extends Component{
   
_isMounted = true;

    constructor(props){
        super(props) ;
        this.state = {
            groupname : this.props.group.groupname ,
            groupid : this.props.group.groupid,
            groupinfo : {}
        }
        this.postComment = this.postComment.bind(this);
    }

    componentDidMount()
    {
        this._isMounted = true;
        
    }
    componentWillUnmount()
    {
        this._isMounted = false;
    }
    render()
    {
        return(
            <div>
                Hello ..........
            </div>
        )
    }
}

export default GetGroup;