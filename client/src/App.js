import Preview from './Preview';
import axios from "axios";
import React, { Component } from 'react';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFiles: null, // user-selected files
            fileInfos: []
        }
    }

    selectFiles = event => {
        event.preventDefault();
        this.setState({
            selectedFiles: event.target.files
        });
    }

    uploadFiles = () => {
        if (this.state.selectedFiles) {
            const data = new FormData();
            for (let i = 0; i < this.state.selectedFiles.length; i++) {
                data.append('file', this.state.selectedFiles[i]);
            }

            axios.post('http://localhost:5000/upload', data)
                .then(res => {
                    console.log(res.statusText)
                })
        }

    }


    filePreview = () => {
        if (this.state.selectedFiles) {
            const selectedFiles = this.state.selectedFiles;
            const filePreview = [];
            for (let file of selectedFiles) {
                filePreview.push([file, file.name]);
            }
            return (
                <>
                    {filePreview.map(file => (
                        <Preview fileTest={file[0]} fileName={file[1]}></Preview>
                    ))}
                </>
            )
        }
    }

    fileSubmit = () => {
        // follows after user has selected image files (this.uploadFiles).
        // takes all input images and pass into algo; 
        // re-route to results page; loading screen while waiting for algo to run
        this.props.history.push('/results')
    }

    render() {
        return (

            <header className="App-header">
                <form onSubmit={this.fileSubmit}>
                    <input type='file'
                        multiple
                        onChange={this.selectFiles}
                        accept="image/jpeg, image/png" />
                    <br />

                    {this.filePreview()}
                    <button type='button' onClick={this.uploadFiles}>upload</button>
                    <br />
                    <button type='submit'>Create my cheatsheet</button>
                </form >
            </header>

        )
    }
}

export default App;