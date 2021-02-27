import Preview from './Preview';
import axios from "axios";
import React, { Component } from 'react';
import './App.css';
import { v4 as uuidv4 } from 'uuid';
const cors = require('cors');

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

    get_file_paths = async () => {
        const file_paths = await axios.get(`http://localhost:5000/get_file_names/${this.state.user_id}`)
        .then(res => {
            console.log(res.data)
            console.log("Done getting file paths!")
            return res.data
        }).catch((err)=> {
            console.log(err)
        })
        return file_paths
    }

    get_image_information = async (file_paths) => {
        const data_image = await axios.post('http://localhost:5000/get_image_information', file_paths)
        .then(res => {
            console.log(res)
            console.log("IM HREEEEE")
            console.log(res.data)
            return res.data
        }).catch((err)=> {
            console.log(err)
        })
        return data_image
    }
    get_final_coordinates = async (data_image) => {
        //test input to coordinates retrieval for images
        axios.post('http://localhost:5000/get_final_coordinates', data_image)
        .then(res => {
            console.log(res)
            //res.data
        })
    }
    
    uploadFiles = async () => {
        if (this.state.selectedFiles) {
            const data = new FormData();
            for (let i = 0; i < this.state.selectedFiles.length; i++) {
                data.append('file', this.state.selectedFiles[i]);
            }
            console.log(this.state.selectedFiles)

            const uploading = await axios.post(`http://localhost:5000/upload/${this.state.user_id}`, data)
                .then(res => {
                    console.log(res.statusText)
                    return this.get_file_paths()
                }).then(res => {
                    return this.get_image_information(res)
                }).then(res => {
                    return this.get_final_coordinates(res)    
                }).catch((err)=> {
                    console.log(err)
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

    componentDidMount() {
        this.setState({
            user_id: uuidv4()
        })
    }

    fileSubmit = () => {
        // follows after user has selected image files (this.uploadFiles).
        // takes all input images and pass into algo; 
        // re-route to results page; loading screen while waiting for algo to run
        this.props.history.push(`/results/${this.state.user_id}`)
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