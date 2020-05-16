import React, { Component } from 'react'

var color = true;

export class Disconnect extends Component {
        
    render() {
        return (
                <button type="button" onClick={this.props.disconnect} > Disconnect</button>
        )
    }
}


export default Disconnect
