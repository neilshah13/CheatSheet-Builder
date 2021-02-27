import React, { Component } from 'react';

class Preview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null
        }
    }

    componentDidMount() {
        this.setState({
            file: URL.createObjectURL(this.props.fileTest)
        })
    }

    render() {
        return (
            <>
                <img src={this.state.file}></img>
                <p>
                    File Name: {this.props.fileName}
                </p>
            </>
        )
    }
}

export default Preview;