import React, { Component } from 'react'

export class Connect extends Component {


    render() {
        return (
                <button type="button" onClick={this.props.connect} >Connect</button>
        )
    }
}

export default Connect

