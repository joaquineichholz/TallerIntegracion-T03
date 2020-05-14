import React, { Component } from 'react'

var color = true;

export class Disconnect extends Component {
        
    render() {
        return (
            <div >
                <button type="button" onClick={this.props.disconnect} > Disconnect</button>
            </div>
        )
    }
}


export default Disconnect
