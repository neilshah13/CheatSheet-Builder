import { Component } from 'react';

class PreviewView extends Component {
    constructor(props) {
        super(props)
    }

    deleteFile = (idx) => {

    }

    render() {
        return (
            <>
                {this.props.previewList.map((idx, value) => {

                })}
            </>
        )
    }
}