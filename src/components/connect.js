import React, { Component } from 'react'

export class Connect extends Component {


    render() {
        return (
            <div>
                <button type="button" onClick={this.props.connect} >Connect</button>
            </div>
        )
    }
}

export default Connect

